#!/usr/bin/env python3
"""
Cloudflare Pages 배포 헬퍼 스크립트
1. 환경변수 CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID 파싱 및 정밀 정제
   - 사용자가 Bearer 접두사, curl 명령어 전체, 따옴표, 개행문자 등을 복사했더라도 자동 추출
2. /user/tokens/verify API로 유효성 검증
3. npx wrangler pages deploy dist --project-name dize-weather --branch main 실행
"""

import json
import os
import re
import subprocess
import sys
import urllib.request
import urllib.error


def extract_token(raw: str) -> str:
    if not raw:
        return ""
    # 1. Bearer 뒤의 40자리 Cloudflare 토큰 우선 추출
    m = re.search(r"Bearer\s+([a-zA-Z0-9_-]{40})", raw, re.IGNORECASE)
    if m:
        return m.group(1)
    # 2. 40자리 영숫자/특수문자 토큰 탐색
    m2 = re.search(r"\b([a-zA-Z0-9_-]{40})\b", raw)
    if m2:
        return m2.group(1)
    # 3. 그 외 따옴표, 공백, 슬래시 등 제거
    cleaned = re.sub(r"[\r\n \"\x27\\]", "", raw)
    cleaned = re.sub(r"^[bB][eE][aA][rR][eE][rR]", "", cleaned)
    return cleaned


def extract_account_id(raw: str) -> str:
    if not raw:
        return ""
    # Cloudflare 계정 ID는 32자리 16진수
    m = re.search(r"([0-9a-fA-F]{32})", raw)
    if m:
        return m.group(1).lower()
    return re.sub(r"[\r\n \"\x27\\]", "", raw).lower()


def main():
    raw_token = os.environ.get("RAW_TOKEN", "") or os.environ.get("CLOUDFLARE_API_TOKEN", "")
    raw_account_id = os.environ.get("RAW_ACCOUNT_ID", "") or os.environ.get("CLOUDFLARE_ACCOUNT_ID", "")

    token = extract_token(raw_token)
    account_id = extract_account_id(raw_account_id)

    if not token or not account_id:
        print("::warning::CLOUDFLARE_API_TOKEN 또는 CLOUDFLARE_ACCOUNT_ID가 비어있어 배포를 건너뜁니다.")
        sys.exit(0)

    print(f"🔍 토큰 유효성 검사 (길이: {len(token)} 글자, 계정ID 길이: {len(account_id)} 글자)...")

    # Cloudflare API 토큰 검증 (/user/tokens/verify)
    req = urllib.request.Request(
        "https://api.cloudflare.com/client/v4/user/tokens/verify",
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "User-Agent": "WeatherCoordination-CI",
        },
        method="GET",
    )

    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            if data.get("success"):
                print("✔ Cloudflare API 토큰 인증 성공!")
            else:
                print(f"::error::토큰 인증 실패 응답: {data}")
                sys.exit(1)
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        print(f"::error::Cloudflare 토큰 인증 실패 ({e.code}): {body}")
        print(f"::notice::CLOUDFLARE_API_TOKEN 형식을 확인해주세요. (현재 추출된 길이: {len(token)}자)")
        sys.exit(1)
    except Exception as e:
        print(f"::error::Cloudflare 토큰 검증 중 통신 오류: {e}")
        sys.exit(1)

    print("🚀 Cloudflare Pages로 배포를 시작합니다...")
    deploy_env = os.environ.copy()
    deploy_env["CLOUDFLARE_API_TOKEN"] = token
    deploy_env["CLOUDFLARE_ACCOUNT_ID"] = account_id

    cmd = [
        "npx",
        "wrangler",
        "pages",
        "deploy",
        "dist",
        "--project-name",
        "dize-weather",
        "--branch",
        "main",
    ]
    res = subprocess.run(cmd, env=deploy_env)
    if res.returncode != 0:
        print(f"::error::Cloudflare Pages 배포 실패 (종료 코드 {res.returncode})")
        sys.exit(res.returncode)

    print("🎉 Cloudflare Pages 배포 성공!")


if __name__ == "__main__":
    main()

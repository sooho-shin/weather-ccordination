/**
 * dize. OOTD 전신 실사 룩북 불변의 카메라 마스터 규격
 * 
 * 규칙:
 * 1. 머리끝부터 발끝(신발 전체)까지 한눈에 보이는 스탠딩 풀바디 샷 (Full-length head-to-toe)
 * 2. 아이레벨 정면 수평 앵글, 왜곡 없는 85mm 풀프레임 화각, 완벽한 중앙 정렬 (Centered framing)
 * 3. 머리 위와 발끝 아래에 적절한 여백 확보 (Ample space above head and below shoes)
 * 4. 바뀌는 것은 오직 '모델의 얼굴(사람)'과 '착장(옷/신발)'뿐! 구도와 카메라 거리는 모든 사진이 쌍둥이처럼 일치해야 함.
 */

export const MASTER_FULLBODY_PROMPT_DIRECTIVE = `Master high-fashion catalog lookbook photograph. Ultra-consistent centered full-body head-to-toe shot of a stylish 20s Korean model standing upright naturally, facing camera directly, centered in 9:16 vertical frame. CRITICAL COMPOSITION: Full length complete body MUST be visible from top of head to bottom of shoes. Clear visible distance between top of head and frame top, and clear floor visible beneath both shoes. Both shoes fully visible and touching the ground. Neutral minimalist architectural background, natural daylight, eye-level straight frontal perspective, 85mm full-frame lens, sharp authentic fabric textures, 8k resolution, photorealistic fashion editorial. Strictly NO close-up, NO waist crop, NO cropped feet, NO cropped shoes, NO cropped head.`;

export const MANDATORY_FULLBODY_KEYWORDS = [
  'full-body',
  'head-to-toe',
  'shoes',
  'centered',
  'eye-level',
];

/**
 * 프롬프트에 마스터 전신 구도 규격을 강제 결합
 */
export function enforceFullBodyFraming(basePrompt: string, gender: 'female' | 'male'): string {
  const genderTerm = gender === 'female' ? 'female' : 'male';
  const customDirective = MASTER_FULLBODY_PROMPT_DIRECTIVE.replace(
    'Korean model',
    `Korean ${genderTerm} model`
  );

  return `${customDirective} Outfit details: ${basePrompt}`;
}

import { handleAiRequest } from '../../lib/aiGuard';

export const onRequestPost = (context: any) => handleAiRequest(context, 'flux');

import type { PlasmoMessaging } from '@plasmohq/messaging';

import type { BaseRequest } from '~types/request';
import type { BaseResponse } from '~types/response';
import { setDynamicRules } from '~utils/declarativeNetRequest';
import { assertDomainWhitelist } from '~utils/storage';

interface Request extends BaseRequest {
  ruleId: number;
  targetDomains?: [string, ...string[]];
  targetRegex?: string;
  requestHeaders?: Record<string, string>;
  responseHeaders?: Record<string, string>;
}

const handler: PlasmoMessaging.MessageHandler<Request, BaseResponse> = async (req, res) => {
  try {
    if (!req.sender?.tab?.url) throw new Error('No tab URL found in the request.');
    if (!req.body) throw new Error('No request body found in the request.');

    await assertDomainWhitelist(req.sender.tab.url);
    await setDynamicRules(req.body);
    res.send({
      success: true,
    });
  } catch (err) {
    res.send({
      success: false,
      error: err instanceof Error ? err.message : String(err),
    });
  }
};

export default handler;

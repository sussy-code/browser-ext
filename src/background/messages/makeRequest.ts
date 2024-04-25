import type { PlasmoMessaging } from '@plasmohq/messaging';

import type { BaseRequest } from '~types/request';
import type { BaseResponse } from '~types/response';
import { removeDynamicRules, setDynamicRules } from '~utils/declarativeNetRequest';
import { isFirefox } from '~utils/extension';
import { makeFullUrl } from '~utils/fetcher';
import { assertDomainWhitelist } from '~utils/storage';

const MAKE_REQUEST_DYNAMIC_RULE = 23498;

export interface Request extends BaseRequest {
  baseUrl?: string;
  headers?: Record<string, string>;
  method?: string;
  query?: Record<string, string>;
  readHeaders?: Record<string, string>;
  url: string;
  body?: any;
  bodyType?: 'string' | 'FormData' | 'URLSearchParams' | 'object';
}

type Response<T> = BaseResponse<{
  response: {
    statusCode: number;
    headers: Record<string, string>;
    finalUrl: string;
    body: T;
  };
}>;

const mapBodyToFetchBody = (body: Request['body'], bodyType: Request['bodyType']): BodyInit => {
  if (bodyType === 'FormData') {
    const formData = new FormData();
    body.forEach(([key, value]: [any, any]) => {
      formData.append(key, value.toString());
    });
  }
  if (bodyType === 'URLSearchParams') {
    return new URLSearchParams(body);
  }
  if (bodyType === 'object') {
    return JSON.stringify(body);
  }
  if (bodyType === 'string') {
    return body;
  }
  return body;
};

const handler: PlasmoMessaging.MessageHandler<Request, Response<any>> = async (req, res) => {
  try {
    if (!req.sender?.tab?.url) throw new Error('No tab URL found in the request.');
    if (!req.body) throw new Error('No request body found in the request.');

    const url = makeFullUrl(req.body.url, req.body);
    await assertDomainWhitelist(req.sender.tab.url);

    await setDynamicRules({
      ruleId: MAKE_REQUEST_DYNAMIC_RULE,
      targetDomains: [new URL(url).hostname],
      requestHeaders: req.body.headers,
    });

    const response = await fetch(url, {
      method: req.body.method,
      headers: req.body.headers,
      body: mapBodyToFetchBody(req.body.body, req.body.bodyType),
    });
    await removeDynamicRules([MAKE_REQUEST_DYNAMIC_RULE]);
    const contentType = response.headers.get('content-type');
    const body = contentType?.includes('application/json') ? await response.json() : await response.text();

    const cookies = await (chrome || browser).cookies.getAll({
      url: response.url,
      ...(isFirefox() && {
        firstPartyDomain: new URL(response.url).hostname,
      }),
    });

    res.send({
      success: true,
      response: {
        statusCode: response.status,
        headers: {
          ...Object.fromEntries(response.headers.entries()),
          'Set-Cookie': cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join(', '),
        },
        body,
        finalUrl: response.url,
      },
    });
  } catch (err) {
    console.error('failed request', err);
    res.send({
      success: false,
      error: err instanceof Error ? err.message : String(err),
    });
  }
};

export default handler;

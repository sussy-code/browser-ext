import { isChrome } from './extension';

interface DynamicRule {
  ruleId: number;
  targetDomains?: [string, ...string[]];
  targetRegex?: string;
  requestHeaders?: Record<string, string>;
  responseHeaders?: Record<string, string>;
}

const mapHeadersToDeclarativeNetRequestHeaders = (
  headers: Record<string, string>,
  op: string,
): { header: string; operation: any; value: string }[] => {
  return Object.entries(headers).map(([name, value]) => ({
    header: name,
    operation: op,
    value,
  }));
};

export const setDynamicRules = async (body: DynamicRule) => {
  if (isChrome()) {
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [body.ruleId],
      addRules: [
        {
          id: body.ruleId,
          condition: {
            ...(body.targetDomains && { requestDomains: body.targetDomains }),
            ...(body.targetRegex && { regexFilter: body.targetRegex }),
          },
          action: {
            type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
            ...(body.requestHeaders && Object.keys(body.requestHeaders).length > 0
              ? {
                  requestHeaders: mapHeadersToDeclarativeNetRequestHeaders(
                    body.requestHeaders,
                    chrome.declarativeNetRequest.HeaderOperation.SET,
                  ),
                }
              : {}),
            responseHeaders: [
              {
                header: 'Access-Control-Allow-Origin',
                operation: chrome.declarativeNetRequest.HeaderOperation.SET,
                value: '*',
              },
              {
                header: 'Access-Control-Allow-Methods',
                operation: chrome.declarativeNetRequest.HeaderOperation.SET,
                value: 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
              },
              {
                header: 'Access-Control-Allow-Headers',
                operation: chrome.declarativeNetRequest.HeaderOperation.SET,
                value: '*',
              },
              {
                header: 'Access-Control-Allow-Credentials',
                operation: chrome.declarativeNetRequest.HeaderOperation.SET,
                value: 'true',
              },
              ...mapHeadersToDeclarativeNetRequestHeaders(
                body.responseHeaders ?? {},
                chrome.declarativeNetRequest.HeaderOperation.SET,
              ),
            ],
          },
        },
      ],
    });
    if (chrome.runtime.lastError?.message) throw new Error(chrome.runtime.lastError.message);
  } else {
    await browser.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [body.ruleId],
      addRules: [
        {
          id: body.ruleId,
          condition: {
            ...(body.targetDomains && { requestDomains: body.targetDomains }),
            ...(body.targetRegex && { regexFilter: body.targetRegex }),
          },
          action: {
            type: 'modifyHeaders',
            ...(body.requestHeaders && Object.keys(body.requestHeaders).length > 0
              ? {
                  requestHeaders: mapHeadersToDeclarativeNetRequestHeaders(body.requestHeaders, 'set'),
                }
              : {}),
            responseHeaders: [
              {
                header: 'Access-Control-Allow-Origin',
                operation: 'set',
                value: '*',
              },
              {
                header: 'Access-Control-Allow-Methods',
                operation: 'set',
                value: 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
              },
              {
                header: 'Access-Control-Allow-Headers',
                operation: 'set',
                value: '*',
              },
              {
                header: 'Access-Control-Allow-Credentials',
                operation: 'set',
                value: 'true',
              },
              ...mapHeadersToDeclarativeNetRequestHeaders(body.responseHeaders ?? {}, 'set'),
            ],
          },
        },
      ],
    });
    if (browser.runtime.lastError?.message) throw new Error(browser.runtime.lastError.message);
  }
};

export const removeDynamicRules = async (ruleIds: number[]) => {
  await (chrome || browser).declarativeNetRequest.updateDynamicRules({
    removeRuleIds: ruleIds,
  });
  if ((chrome || browser).runtime.lastError?.message)
    throw new Error((chrome || browser).runtime.lastError?.message ?? 'Unknown error');
};

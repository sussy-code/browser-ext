import { isChrome } from './extension';

export function queryCurrentDomain(cb: (domain: string | null) => void) {
  const handle = (tabUrl: string | undefined) => {
    if (!tabUrl) cb(null);
    else cb(tabUrl);
  };
  const ops = { active: true, currentWindow: true } as const;

  if (isChrome()) chrome.tabs.query(ops).then((tabs) => handle(tabs[0]?.url));
  else browser.tabs.query(ops).then((tabs) => handle(tabs[0]?.url));
}

export function listenToTabChanges(cb: () => void) {
  if (isChrome()) {
    chrome.tabs.onActivated.addListener(cb);
    chrome.tabs.onUpdated.addListener(cb);
  } else if (browser) {
    browser.tabs.onActivated.addListener(cb);
    browser.tabs.onUpdated.addListener(cb);
  }
}

export function stopListenToTabChanges(cb: () => void) {
  if (isChrome()) {
    chrome.tabs.onActivated.removeListener(cb);
    chrome.tabs.onUpdated.removeListener(cb);
  } else if (browser) {
    browser.tabs.onActivated.removeListener(cb);
    browser.tabs.onUpdated.removeListener(cb);
  }
}

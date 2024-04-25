export const isChrome = () => {
  return chrome.runtime.getURL('').startsWith('chrome-extension://');
};

export const isFirefox = () => {
  try {
    return browser.runtime.getURL('').startsWith('moz-extension://');
  } catch {
    return false;
  }
};

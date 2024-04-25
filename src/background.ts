import { isChrome } from '~utils/extension';

// Both brave and firefox for some reason need this extension reload,
// If this isn't done, they will never load properly and will fail updateDynamicRules()
if (isChrome()) {
  chrome.runtime.onStartup.addListener(() => {
    chrome.runtime.reload();
  });
} else {
  browser.runtime.onStartup.addListener(() => {
    browser.runtime.reload();
  });
}

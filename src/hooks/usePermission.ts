import { useCallback, useEffect, useState } from 'react';

import { useDomainWhitelist } from './useDomainWhitelist';

export async function hasPermission() {
  return chrome.permissions.contains({
    origins: ['<all_urls>'],
  });
}

export function usePermission() {
  const { addDomain } = useDomainWhitelist();
  const [permission, setPermission] = useState(false);

  const grantPermission = useCallback(async (domain?: string) => {
    const granted = await chrome.permissions.request({
      origins: ['<all_urls>'],
    });
    setPermission(granted);
    if (granted && domain) addDomain(domain);
    return granted;
  }, []);

  useEffect(() => {
    hasPermission().then((has) => setPermission(has));
  }, []);

  return {
    hasPermission: permission,
    grantPermission,
  };
}

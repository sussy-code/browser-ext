import { Storage } from '@plasmohq/storage';
import { useStorage } from '@plasmohq/storage/hook';

import { makeUrlIntoDomain } from '~utils/domains';

export const DEFAULT_DOMAIN_WHITELIST = [];

export const modifiableResponseHeaders = [
  'access-control-allow-origin',
  'access-control-allow-methods',
  'access-control-allow-headers',
  'content-security-policy',
  'content-security-policy-report-only',
  'content-disposition',
];

const hostsWithCookiesAccess: RegExp[] = [
  /^(?:.*\.)?ee3\.me$/,
  /^(?:.*\.)?rips\.cc$/,
  /^(?:.*\.)?m4ufree\.(?:tv|to|pw)$/,
  /^(?:.*\.)?goojara\.to$/,
  /^(?:.*\.)?levidia\.ch$/,
  /^(?:.*\.)?wootly\.ch$/,
  /^(?:.*\.)?multimovies\.(?:sbs|online|cloud)$/,
];

export function canAccessCookies(host: string): boolean {
  if (hostsWithCookiesAccess.some((regex) => regex.test(host))) return true;
  return false;
}

export const storage = new Storage();

const getDomainWhiteList = async () => {
  const whitelist = await storage.get<string[]>('domainWhitelist');
  if (!whitelist) await storage.set('domainWhitelist', DEFAULT_DOMAIN_WHITELIST);
  return whitelist ?? DEFAULT_DOMAIN_WHITELIST;
};

const domainIsInWhitelist = async (domain: string) => {
  const whitelist = await getDomainWhiteList();
  return whitelist?.some((d) => d.includes(domain)) ?? false;
};

export function useDomainStorage() {
  return useStorage<string[]>('domainWhitelist', (v) => v ?? DEFAULT_DOMAIN_WHITELIST);
}

export const isDomainWhitelisted = async (url: string | undefined) => {
  if (!url) return false;
  const domain = makeUrlIntoDomain(url);
  if (!domain) return false;
  return domainIsInWhitelist(domain);
};

export const assertDomainWhitelist = async (url: string) => {
  const isWhiteListed = await isDomainWhitelisted(url);
  const currentDomain = makeUrlIntoDomain(url);
  if (!isWhiteListed)
    throw new Error(
      `${currentDomain} is not whitelisted. Open the extension and click on the power button to whitelist the site.`,
    );
};

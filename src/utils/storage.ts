import { Storage } from '@plasmohq/storage';
import { useStorage } from '@plasmohq/storage/hook';

import { makeUrlIntoDomain } from '~utils/domains';

export const DEFAULT_DOMAIN_WHITELIST = [
  'mw.lonelil.ru',
  'watch.qtchaos.de',
  'bmov.app',
  'bmov.vercel.app',
  'stream.thehairy.me',
  'scootydooter.vercel.app',
  'movie-web-me.vercel.app',
];

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

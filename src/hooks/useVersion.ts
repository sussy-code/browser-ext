export function getVersion(ops?: { prefixed?: boolean }) {
  const prefix = ops?.prefixed ? 'v' : '';
  const manifest = (chrome || browser).runtime.getManifest();
  return `${prefix}${manifest.version}`;
}

export function useVersion(ops?: { prefixed?: boolean }) {
  return getVersion(ops);
}

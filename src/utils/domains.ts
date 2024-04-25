export function makeUrlIntoDomain(url: string): string | null {
  try {
    const u = new URL(url);
    if (!['http:', 'https:'].includes(u.protocol)) return null;
    return u.host.toLowerCase();
  } catch {
    return null;
  }
}

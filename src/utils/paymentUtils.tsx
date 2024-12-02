export function sanitizeWaveUrlBasedOnDevice(url: string): string {
  const prefix = "wave://capture/";

  // Check if the user is on a mobile device
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);

  // If not on mobile and the URL starts with the prefix, remove the prefix
  if (!isMobile && url.startsWith(prefix)) {
    return url.substring(prefix.length);
  }

  // Otherwise, return the URL as is
  return url;
}

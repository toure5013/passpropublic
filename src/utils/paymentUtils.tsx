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


export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  
  // Extract date components
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();
  
  // Extract time components
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  // Format the date and time
  return `${day}/${month}/${year} à ${hours}:${minutes}`;
}
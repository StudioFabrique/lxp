export const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const BASE_API_URL = import.meta.env.VITE_API_BASE_URL + "v1";

// Keep URL concatenations from producing protocol-relative URLs ("//file").
// In production the API is served from the same origin and the configured
// value is "/", so the normalized base is intentionally an empty string.
export const DOWNLOAD_URL = import.meta.env.VITE_CSV_DOWNLOAD_URL.replace(
  /\/+$/,
  "",
);

export const ACTIVITIES = import.meta.env.VITE_API_BASE_URL + "activities/";

export const SOCKET_URL = import.meta.env.VITE_API_BASE_URL;

export const ACTIVITIES_VIDEOS =
  import.meta.env.VITE_API_BASE_URL + "activities/videos/";

export const COMPANY_LOGO =
  import.meta.env.VITE_API_BASE_URL + "company/company-logo.jpeg";

export const COMPANY_LOGO_COLOR =
  import.meta.env.VITE_API_BASE_URL + "company/company-color.txt";

const url =
  process.env.NODE_ENV === "development"
    ? import.meta.env.VITE_HTTPS_ENABLED === "true"
      ? "https://localhost:5001/"
      : "http://localhost:5001/"
    : "/";

export const BASE_URL = url + "v1";

export const DOWNLOAD_URL = process.env.NODE_ENV === "development" ? url : "/";

export const ACTIVITIES = url + "activities/";

export const SOCKET_URL = url;

export const ACTIVITIES_VIDEOS = url + "activities/videos/";

export const COMPANY_LOGO = url + "company/company-logo.jpeg";

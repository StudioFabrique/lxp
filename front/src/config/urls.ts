const url =
  process.env.NODE_ENV === "development" ? "http://localhost:5001/" : "/";

export const BASE_URL = url + "v1";

export const DOWNLOAD_URL = url;

export const ACTIVITIES = url + "activities/";

export const SOCKET_URL = url;

export const ACTIVITIES_VIDEOS = url + "activities/videos/";

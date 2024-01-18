const url =
  process.env.NODE_ENV === "development" ? "http://localhost:5001/v1" : "/v1";

export const BASE_URL = url;

export const DOWNLOAD_URL = "http://localhost:5001/";

export const ACTIVITIES_VIDEOS = "http://api:5001/activities/videos/";

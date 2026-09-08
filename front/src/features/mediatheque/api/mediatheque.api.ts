import apiClient from "../../../lib/axios";

export type MediathequeQuery = {
  page: number;
  limit: number;
  type: string;
  sort: string;
  search?: string;
};

export type MediathequePage<T> = {
  medias: T[];
  total: number;
  totalPages: number;
};

const queries = {
  getPaginated: async <T>(
    params: MediathequeQuery,
  ): Promise<MediathequePage<T>> => {
    const res = await apiClient.get<MediathequePage<T>>("/media", { params });
    return res.data;
  },
};

export const mediathequeApi = { queries };

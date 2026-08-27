export type SearchResultSource = Record<string, unknown> & {
  prismaId?: string | number | null;
};

export type SearchResultHit = {
  _index: string;
  _id: string;
  _source: SearchResultSource;
};

export type SearchResultsData = Record<
  string,
  {
    hits: {
      hits: SearchResultHit[];
    };
  }
>;

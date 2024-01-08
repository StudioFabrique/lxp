import { Request, Response } from "express";
import elasticSearchClient from "../../elastic-search/elastic-search";
import { elasticSearchTerms } from "../../config/elasticSearchTerms";

export default async function httpSearchParcours(req: Request, res: Response) {
  const { searchValue, parcoursId } = req.params;

  try {
    const searchResultWith = await elasticSearchClient.search({
      query: {
        bool: {
          must: [
            {
              multi_match: {
                query: searchValue,
                fields: elasticSearchTerms,
              },
            },
            {
              bool: {
                must: [
                  {
                    exists: {
                      field: "parcours_id",
                    },
                  },
                  {
                    terms: {
                      parcours_id: [parseInt(parcoursId)],
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    });

    const searchResultWithAll = await elasticSearchClient.search({
      query: {
        bool: {
          must: [
            {
              multi_match: {
                query: searchValue,
                fields: elasticSearchTerms,
              },
            },
            {
              bool: {
                must: [
                  {
                    exists: {
                      field: "parcours_id",
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    });

    const searchResultWithout = await elasticSearchClient.search({
      query: {
        bool: {
          must: [
            {
              multi_match: {
                query: searchValue,
                fields: elasticSearchTerms,
              },
            },
            {
              bool: {
                must_not: [
                  {
                    exists: {
                      field: "parcours_id",
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    });

    return res.status(200).json({
      "dans ce parcours": searchResultWith,
      "dans tous les parcours": searchResultWithAll,
      autres: searchResultWithout,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "erreur serveur" });
  }
}

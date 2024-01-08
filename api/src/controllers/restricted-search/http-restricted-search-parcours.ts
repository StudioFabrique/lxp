import { Request, Response } from "express";
import elasticSearchClient from "../../elastic-search/elastic-search";
import { elasticSearchTerms } from "../../config/elasticSearchTerms";
import Group from "../../utils/interfaces/db/group";

export default async function httpRestrictedSearchParcours(
  req: Request,
  res: Response
) {
  const { searchValue, parcoursId, userId } = req.params;

  try {
    const groups = await Group.find({ users: { _id: userId } });

    const parcoursIdFromGroup = (
      await prisma?.parcours.findMany({
        where: {
          OR: [
            {
              groups: {
                some: {
                  group: {
                    idMdb: { in: groups.map((group) => group._id as string) },
                  },
                },
              },
            },
            {
              contacts: {
                some: {
                  contact: {
                    idMdb: userId,
                  },
                },
              },
            },
          ],
        },
      })
    )?.map((parcours) => parcours.id);

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
                  {
                    terms: {
                      parcours_id: parcoursIdFromGroup ?? [2],
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
      "dans tous mes parcours": searchResultWithAll,
      autres: searchResultWithout,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "erreur serveur" });
  }
}

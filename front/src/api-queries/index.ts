import { groupMutations } from "./group.api";
import { paginatedQueries } from "./table.api";

export default {
  group: {
    // query: groupQueries,
    mutate: groupMutations,
  },
  table: {
    query: paginatedQueries,
    // mutate: tableMutation
  },
};

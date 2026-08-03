import Tag from "../../../../../../src/utils/interfaces/tag";

export const splitAvailableTags = (
  availableTags: Tag[],
  inheritedTags: Tag[],
  searchTerm = "",
) => {
  const inheritedTagIds = new Set(inheritedTags.map((tag) => tag.id));
  const normalizedSearchTerm = searchTerm.trim().toLocaleLowerCase();
  const matchesSearch = (tag: Tag) =>
    normalizedSearchTerm.length === 0 ||
    tag.name.toLocaleLowerCase().includes(normalizedSearchTerm);

  return {
    inheritedTags: availableTags.filter(
      (tag) => inheritedTagIds.has(tag.id) && matchesSearch(tag),
    ),
    globalTags: availableTags.filter(
      (tag) => !inheritedTagIds.has(tag.id) && matchesSearch(tag),
    ),
  };
};

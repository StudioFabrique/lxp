export default function convertSearchResultToIndices(hits: any): Array<string> {
  const filteredIndicesList = hits
    .map((element: any) => element._index)
    .filter((index: any, i: number, initialArray: Array<string>) => {
      return initialArray.indexOf(index) === i;
    });

  return filteredIndicesList;
}

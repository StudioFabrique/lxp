export const searchResult = (
  inputValue: string,
  propertiesToSearch: string[],
  data: any[]
) => {
  const inputValueToArray: string[] = inputValue.split(" ");
  console.log(inputValueToArray);
  const result = inputValueToArray.map((inputValue, i) =>
    data.filter(
      (data) =>
        data[propertiesToSearch[i]].toLowerCase() === inputValue.toLowerCase()
    )
  );
  console.log(result);
  return result;
  /* Maintenant que ces résultats affichent la liste des datas associés à chaque champs de recherche,
     il faut les filtrer à faire en sorte de ne pas avoir de doublons */
};

export const filterResult = (searchResult: any[][]): any[] => {
  let idList: string[] = [];
  searchResult.map((arrays) => arrays.map((data) => idList.push(data._id)));
  const cleanIdList = idList.filter((id, i) => idList.indexOf(id) === i);
  return cleanIdList;
};

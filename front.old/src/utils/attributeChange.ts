import { ChangeEvent } from "react";

/* 
  EN TEST POUR L'INSTANT
  Récupère la valeur de l'attribut "name" lors de l'évenement du changement de l'input (texte ou date) puis
  en fonction de cette valeur, change la propriété de l'objet ayant le nom de cette valeur de l'attribut "name"
*/
export default function attributeChange(
  event: ChangeEvent<HTMLInputElement>,
  object: any,
  stateSetter: (value: React.SetStateAction<any | undefined>) => void
) {
  const attributeName = event.currentTarget.getAttribute("name");
  console.log(Object.keys(object));

  Object.keys(object).forEach((element) => {
    const objectName = Object.keys(element).pop();
    if (attributeName === objectName) {
      stateSetter({ [attributeName]: event.currentTarget.value });
    } else {
      stateSetter({
        [object[objectName!]]:
          typeof object[objectName!] === "string"
            ? object[objectName!] ?? ""
            : object[objectName!] ?? new Date(),
      });
    }
    console.log(`${attributeName}, ${objectName}`);
  });
}

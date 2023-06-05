import React from "react";
import ParcoursInfos from "../parcours-infos/parcours-infos.component";
import DatesSelecter from "../UI/dates-selecter/dates-selecter.component";
import Tags from "../UI/tags/tags.component";
import ParcoursRessourcesContacts from "../parcours-ressources-contacts/parcours-ressources-contacts.component";

const ParcoursForm = () => {
  return (
    <div className="w-full grid auto-cols-max grid-cols-1 lg:grid-cols-3 gap-y-8 gap-x-4">
      <div>
        <ParcoursInfos />
      </div>
      <div>
        <DatesSelecter />
        <Tags />
      </div>
      <div>
        <ParcoursRessourcesContacts />
      </div>
    </div>
  );
};

export default ParcoursForm;

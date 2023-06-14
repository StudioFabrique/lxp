import React from "react";
import ParcoursHeader from "../../components/parcours-header/parcours-header.component";
import ParcoursForm from "../../components/parcours-form/parcours-form.component";

const ParcoursHome = () => {
  return (
    <div className="w-full flex flex-col items-center px-4 py-8 gap-8">
      <ParcoursHeader />
      <ParcoursForm />
    </div>
  );
};

export default ParcoursHome;

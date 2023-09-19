import React, { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";

const ParcoursPreview = () => {
  const infos = useSelector((state: any) => state.parcoursInformations);
  const tags = useSelector((state: any) => state.tags);
  const contacts = useSelector((state: any) => state.parcoursContacts);
  const objectives = useSelector((state: any) => state.parcoursObjectives);
  const skills = useSelector((state: any) => state.parcoursskills);
  const modules = useSelector((state: any) => state.parcoursModules);

  const parcours = useMemo(
    () => ({
      title: infos.title,
      description: infos.description,
      startDate: infos.startDate,
      endDate: infos.endDate,
      tags,
      contacts,
      objectives,
      skills,
      modules,
    }),
    [
      infos.title,
      infos.description,
      infos.startDate,
      infos.endDate,
      tags,
      contacts,
      objectives,
      skills,
      modules,
    ]
  );

  useEffect(() => {}, [parcours]);

  return <div></div>;
};

export default ParcoursPreview;

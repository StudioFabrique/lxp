/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDispatch } from "react-redux";
import { useCallback, useEffect, useState } from "react";

import useHttp from "../../../../hooks/use-http";
import { parcoursAction } from "../../../../store/redux-toolkit/parcours/parcours";
import { parcoursInformationsAction } from "../../../../store/redux-toolkit/parcours/parcours-informations";
import { tagsAction } from "../../../../store/redux-toolkit/tags";
import { parcoursContactsAction } from "../../../../store/redux-toolkit/parcours/parcours-contacts";
import { parcoursSkillsAction } from "../../../../store/redux-toolkit/parcours/parcours-skills";
import { parcoursObjectivesAction } from "../../../../store/redux-toolkit/parcours/parcours-objectives";
import { parcoursModulesSliceActions } from "../../../../store/redux-toolkit/parcours/parcours-modules";
import { parcoursGroupsAction } from "../../../../store/redux-toolkit/parcours/parcours-groups";

const useParcoursService = () => {
  const { error, isLoading, sendRequest } = useHttp();
  const dispatch = useDispatch();
  const [image, setImage] = useState<string>("");

  const getParcours = useCallback(
    (parcoursId: number) => {
      const processData = (data: any) => {
        dispatch(parcoursAction.setParcoursId(data.id));
        dispatch(
          parcoursInformationsAction.updateParcoursInfos({
            title: data.title,
            description: data.description,
            isPublished: data.isPublished,
            visibility: data.visibility,
          })
        );
        dispatch(
          parcoursInformationsAction.updateParcoursDates({
            startDate: data.startDate,
            endDate: data.endDate,
          })
        );
        dispatch(parcoursAction.setParcoursFormation(data.formation));
        if (data.image) {
          setImage(`data:image/jpeg;base64,${data.image}`);
        }
        if (data.tags.length > 0) {
          dispatch(
            tagsAction.setCurrentTags(data.tags.map((item: any) => item.tag))
          );
        } else {
          dispatch(
            tagsAction.setCurrentTags(
              data.formation.tags.map((item: any) => item.tag)
            )
          );
        }
        if (data.virtualClass) {
          dispatch(
            parcoursInformationsAction.setVirtualClass(data.virtualClass)
          );
        }
        if (data.contacts.length > 0) {
          dispatch(
            parcoursContactsAction.setCurrentContacts(
              data.contacts.map((item: any) => item.contact)
            )
          );
        }
        if (data.skills.length > 0) {
          dispatch(
            parcoursSkillsAction.setSkillsList(
              data.skills.map((item: any) => item.skill)
            )
          );
        }
        if (data.bonusSkills.length > 0) {
          dispatch(parcoursSkillsAction.setSkillsList(data.bonusSkills));
        }
        if (data.objectives.length > 0) {
          dispatch(
            parcoursObjectivesAction.addImportedObjectivesToObjectives(
              data.objectives
            )
          );
        }
        if (data.modules.length > 0) {
          dispatch(
            parcoursModulesSliceActions.setModules(
              data.modules.map((item: any) => {
                return {
                  ...item.module,
                  contacts: item.module.contacts.map(
                    (itemContact: any) => itemContact.contact
                  ),
                  bonusSkills: item.module.bonusSkills.map(
                    (itemBonusSkills: any) => itemBonusSkills.bonusSkill
                  ),
                };
              })
            )
          );
        } else {
          dispatch(parcoursModulesSliceActions.setModules([]));
        }
        if (data.groups.length > 0) {
          dispatch(
            parcoursGroupsAction.setGroupsIds(
              data.groups.map((item: any) => item.group)
            )
          );
        } else {
          dispatch(parcoursGroupsAction.setGroups([]));
        }
      };
      sendRequest(
        {
          path: `/parcours/parcours-by-id/${parcoursId}`,
        },
        processData
      );
    },
    [dispatch, sendRequest]
  );

  useEffect(() => {
    return () => setImage("");
  }, []);

  return {
    getParcours,
    isLoading,
    error,
    image,
  };
};

export default useParcoursService;

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParcoursSelector } from "../../../store/ParcoursContext";
import Wrapper from "../../../../../../src.legacy/components/UI/wrapper/wrapper.component";
import SubWrapper from "../../../../../../src.legacy/components/UI/sub-wrapper/sub-wrapper.component";
import ContactsList from "./contacts-list.component";
import Contact from "../../../../../../src/utils/interfaces/contact";
import Tag from "../../../../../../src/utils/interfaces/tag";
import TagsList from "./tags-list.component";
import { localeDate } from "../../../../../utils/helpers/locale-date";
import EditIcon from "../../../../../../src.legacy/components/UI/svg/edit-icon";

interface ParcoursPreviewInfosProps {
  onEdit: (id: number) => void;
}

/* Informations générales du parcours */
const ParcoursPreviewInfos = (props: ParcoursPreviewInfosProps) => {
  const parcours = useParcoursSelector((state) => state.parcours.formation);
  const infos = useParcoursSelector((state) => state.parcoursInformations.infos);
  const contacts = useParcoursSelector(
    (state) => state.parcoursContacts.currentContacts
  ) as Contact[];
  const tags = useParcoursSelector((state) => state.tags.currentTags) as Tag[];

  return (
    <Wrapper>
      <div className="flex flex-col gap-y-8">
        <span className="w-full flex justify-between items-center">
          <h2 className="text-xl font-bold">Informations</h2>
          <div
            className="w-6 h-6 text-primary cursor-pointer"
            onClick={() => props.onEdit(1)}
          >
            <EditIcon />
          </div>
        </span>
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Colonne #1 */}
          <article className="flex flex-col gap-y-4">
            <Wrapper>
              <h2 className="text-xl font-bold">Formation</h2>
              <SubWrapper>{parcours.title}</SubWrapper>
              <h2 className="text-xl font-bold">Titre du parcours</h2>
              <SubWrapper>{infos.title}</SubWrapper>
              <h2 className="text-xl font-bold">Description du parcours</h2>
              <div className="text-xs max-h-[35vh] overflow-auto scrollbar scrollbar-thumb-secondary scrollbar-track-primary">
                <SubWrapper>
                  <div className="p-4">{infos.description}</div>
                </SubWrapper>
              </div>
              <h2 className="text-xl font-bold">Niveau du parcours</h2>
              <SubWrapper>{parcours.level}</SubWrapper>
              <h2 className="text-xl font-bold">Classe virtuelle</h2>
              <SubWrapper>
                <p>{infos.virtualClass || "Non renseigné"}</p>
              </SubWrapper>
            </Wrapper>
          </article>
          {/* Colonne #2 */}
          <article className="flex flex-col gap-y-8">
            <Wrapper>
              <h2 className="text-xl font-bold">Ressources pédagogiques</h2>
              <ContactsList contactsList={contacts} />
            </Wrapper>
            <Wrapper>
              <h2 className="text-xl font-bold">Tags</h2>
              <TagsList tagsList={tags} />
            </Wrapper>
            <Wrapper>
              <h2 className="text-xl font-bold">Dates du parcours</h2>
              <SubWrapper>
                <span className="flex">
                  <p className="w-24">Début :</p>
                  <p>{localeDate(infos.startDate)}</p>
                </span>
              </SubWrapper>
              <SubWrapper>
                <span className="flex">
                  <p className="w-24">Fin :</p>
                  <p>{localeDate(infos.endDate)}</p>
                </span>
              </SubWrapper>
            </Wrapper>
          </article>
        </div>
      </div>
    </Wrapper>
  );
};

export default ParcoursPreviewInfos;

import { useSelector } from "react-redux";
import Wrapper from "../../UI/wrapper/wrapper.component";
import SubWrapper from "../../UI/sub-wrapper/sub-wrapper.component";
import ContactsList from "./contacts-list.component";
import Contact from "../../../utils/interfaces/contact";
import Tag from "../../../utils/interfaces/tag";
import TagsList from "./tags-list.component";
import { localeDate } from "../../../helpers/locale-date";
import EditIcon from "../../UI/svg/edit-icon";

interface ParcoursPreviewInfosProps {
  onEdit: (id: number) => void;
}

/* Informations générales du parcours */
const ParcoursPreviewInfos = (props: ParcoursPreviewInfosProps) => {
  const parcours = useSelector((state: any) => state.parcours.formation);
  const infos = useSelector((state: any) => state.parcoursInformations.infos);
  const contacts = useSelector(
    (state: any) => state.parcoursContacts.currentContacts
  ) as Contact[];
  const tags = useSelector((state: any) => state.tags.currentTags) as Tag[];

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
              <h2 className="text-xl font-bold">Ressources et contacts</h2>
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

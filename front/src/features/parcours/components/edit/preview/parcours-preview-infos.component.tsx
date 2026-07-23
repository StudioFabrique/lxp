import { useParams } from "react-router";
import Wrapper from "../../../../../../src/components/wrappers/BoxWrapper";
import SubWrapper from "../../../../../../src/components/wrappers/SubBoxWrapper";
import ContactsList from "./contacts-list.component";
import Tag from "../../../../../../src/utils/interfaces/tag";
import TagsList from "./tags-list.component";
import { localeDate } from "../../../../../utils/helpers/locale-date";
import EditIcon from "../../../../../../src/components/UI/svg/edit-icon";
import { useParcoursQuery } from "../../../hooks/useParcoursQuery";

interface ParcoursPreviewInfosProps {
  onEdit: (id: number) => void;
}

/* Informations générales du parcours */
const ParcoursPreviewInfos = (props: ParcoursPreviewInfosProps) => {
  const { id } = useParams();
  const { data: parcours } = useParcoursQuery(id ? Number(id) : undefined);
  const contacts = parcours?.contacts ?? [];
  const tags = (parcours?.tags ?? []).map((item) =>
    "tag" in item ? (item.tag as Tag) : item,
  );

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
              <SubWrapper>{parcours?.formation.title}</SubWrapper>
              <h2 className="text-xl font-bold">Titre du parcours</h2>
              <SubWrapper>{parcours?.title}</SubWrapper>
              <h2 className="text-xl font-bold">Description du parcours</h2>
              <div className="text-xs max-h-[35vh] overflow-auto scrollbar scrollbar-thumb-secondary scrollbar-track-primary">
                <SubWrapper>
                  <div className="p-4">{parcours?.description}</div>
                </SubWrapper>
              </div>
              <h2 className="text-xl font-bold">Niveau du parcours</h2>
              <SubWrapper>{parcours?.formation.level}</SubWrapper>
              <h2 className="text-xl font-bold">Classe virtuelle</h2>
              <SubWrapper>
                <p>{parcours?.virtualClass || "Non renseigné"}</p>
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
                  <p>{localeDate(parcours?.startDate ?? "")}</p>
                </span>
              </SubWrapper>
              <SubWrapper>
                <span className="flex">
                  <p className="w-24">Fin :</p>
                  <p>{localeDate(parcours?.endDate ?? "")}</p>
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

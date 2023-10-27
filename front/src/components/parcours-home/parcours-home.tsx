import { parcoursSearchOptions } from "../../config/search-options";
import Parcours from "../../utils/interfaces/parcours";
import ButtonAdd from "../UI/button-add/button-add";
import Can from "../UI/can/can.component";
import Header from "../UI/header";
import Search from "../UI/search/search.component";
import RefreshIcon from "../UI/svg/refresh-icon.component";

interface ParcoursListProps {
  parcoursList: Parcours[];
}

const ParcoursList = (props: ParcoursListProps) => {
  return (
    <main className="w-5/6 flex flex-col items-center px-4 py-8 gap-8">
      <section className="w-full">
        <Header
          title="Liste des parcours"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin in urna eget pura."
        />
      </section>
      <section className="w-full flex justify-between items-center">
        <div className="w-full flex flex-col gap-y-8">
          <div className="w-full flex items-center">
            <div className="flex justify-start">
              <Can action="write" object="parcours">
                <ButtonAdd label="Créer un parcours" onClickEvent={() => {}} />
              </Can>
            </div>
            <div className="w-full flex justify-end items-center gap-x-2">
              <Search
                options={parcoursSearchOptions}
                placeholder="Filtrer par ..."
                onSearch={() => {}}
              />
              <div className="text-primary" onClick={() => {}}>
                <RefreshIcon size={6} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ParcoursList;

import { useSelector } from "react-redux";
import Module from "../../../../utils/interfaces/module";
import SubWrapper from "../../../UI/sub-wrapper/sub-wrapper.component";
import BookIcon from "../../../UI/svg/book-icon";

const ParcoursViewContenuDetail = () => {
  const modules = useSelector(
    (state: any) => state.parcoursModules.modules
  ) as Module[];

  const contentsList =
    modules.length > 0 ? (
      modules.map((module, i) => (
        <div
          key={module.id}
          className="flex items-center bg-primary-focus p-4 rounded-lg hover:bg-secondary-focus"
        >
          <span className="w-14 mx-2">
            <BookIcon />
          </span>
          <div className="flex flex-col items-center">
            <p className="self-start">{`Cours ${i + 1}`}</p>
            <div className="flex justify-between w-full">
              <p className="self-start text-xl font-bold">{module.title}</p>
            </div>
          </div>
        </div>
      ))
    ) : (
      <p>Aucun cours</p>
    );

  return (
    <SubWrapper>
      <h2 className="text-xl font-bold text-primary">Contenu du module</h2>
      <div className="flex flex-col gap-y-5">{contentsList}</div>
    </SubWrapper>
  );
};

export default ParcoursViewContenuDetail;

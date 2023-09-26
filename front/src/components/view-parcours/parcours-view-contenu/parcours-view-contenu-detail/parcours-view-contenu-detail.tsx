import { useSelector } from "react-redux";
import Module from "../../../../utils/interfaces/module";
import SubWrapper from "../../../UI/sub-wrapper/sub-wrapper.component";
import BookIcon from "../../../UI/svg/book-icon";
import { colorStyle, colorStyleHover } from "../../../../config/colors";

const ParcoursViewContenuDetail = () => {
  const modules = useSelector(
    (state: any) => state.parcoursModules.modules
  ) as Module[];

  const contentsList =
    modules.length > 0 ? (
      modules.map((module, i) => (
        <div
          key={module.id}
          className={`flex items-center bg-secondary p-4 rounded-lg ${colorStyle} ${colorStyleHover}`}
        >
          <span className="w-14 mx-4">
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

import { FC, useState } from "react";
import ModulesForm from "./modules-form/modules-form";
import Module from "../../utils/interfaces/module";
import Wrapper from "../UI/wrapper/wrapper.component";
import ModulesList from "./modules-list/modules-list.component";
import { Provider } from "react-redux";
import store from "../../store/redux-toolkit";

/* interface IParcoursModules {
  modules: Module[];
  setModules: Dispatch<SetStateAction<Module[]>>;
} */

const ParcoursModules: FC</* IParcoursModules */ {}> = (props) => {
  return (
    <Provider store={store}>
      <div className="p-5 ml-32 mr-32 h-full">
        <Wrapper>
          <div className=" grid grid-cols-3 h-full">
            <ModulesForm />
            <ModulesList />
          </div>
        </Wrapper>
      </div>
    </Provider>
  );
};

export default ParcoursModules;

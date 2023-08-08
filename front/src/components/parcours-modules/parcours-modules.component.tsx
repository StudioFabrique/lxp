import { FC } from "react";
import ModulesForm from "./modules-form/modules-form";
import Wrapper from "../UI/wrapper/wrapper.component";
import ModulesList from "./modules-list/modules-list.component";
import { Provider } from "react-redux";
import store from "../../store/redux-toolkit";

const ParcoursModules: FC<{}> = (props) => {
  return (
    <Provider store={store}>
      <div className="w-full max-lg:mx-0">
        <Wrapper>
          <div className="w-full grid grid-cols-2 max-lg:grid-cols-1 max-lg:grid-rows-2 ">
            <ModulesForm />
            <ModulesList />
          </div>
        </Wrapper>
      </div>
    </Provider>
  );
};

export default ParcoursModules;

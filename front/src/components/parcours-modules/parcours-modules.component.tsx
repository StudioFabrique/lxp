import { FC } from "react";
import ModulesForm from "./modules-form/modules-form";
import Wrapper from "../UI/wrapper/wrapper.component";
import ModulesList from "./modules-list/modules-list.component";
import { Provider } from "react-redux";
import store from "../../store/redux-toolkit";

const ParcoursModules: FC<{}> = (props) => {
  return (
    <Provider store={store}>
      <div className="p-5 mx-32 max-md:mx-0">
        <Wrapper>
          <div className="grid grid-cols-2 max-md:grid-cols-1 max-md:grid-rows-2 ">
            <ModulesForm />
            <ModulesList />
          </div>
        </Wrapper>
      </div>
    </Provider>
  );
};

export default ParcoursModules;

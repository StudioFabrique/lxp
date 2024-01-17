import { ReactNode } from "react";
import Wrapper from "../wrapper/wrapper.component";

const SidebarWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <nav className="w-fit h-full fixed p-5">
      <Wrapper>
        <div className="h-full flex flex-col justify-between">{children}</div>
      </Wrapper>
    </nav>
  );
};

export default SidebarWrapper;

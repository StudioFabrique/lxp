import { ReactNode } from "react";
import Wrapper from "../wrapper/wrapper.component";

const Sidebar = ({ children }: { children: ReactNode }) => {
  return (
    <nav className="w-fit h-fit fixed">
      <Wrapper>{children}</Wrapper>
    </nav>
  );
};

export default Sidebar;

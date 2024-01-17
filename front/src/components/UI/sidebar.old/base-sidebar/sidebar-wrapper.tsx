import { ReactNode } from "react";
import Wrapper from "../../wrapper/wrapper.component";

const SidebarWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <nav className="w-fit h-full fixed p-5">
      <Wrapper>{children}</Wrapper>
    </nav>
  );
};

export default SidebarWrapper;

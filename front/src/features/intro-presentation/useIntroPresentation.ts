import { useContext } from "react";

import { IntroPresentationContext } from "./IntroPresentationContext";

export const useIntroPresentation = () => useContext(IntroPresentationContext);

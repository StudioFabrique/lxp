import ReactDOM from "react-dom/client";
import App from "./app/App.tsx";
import TooltipLayer from "./components/UI/tooltip-layer.tsx";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(<><App /><TooltipLayer /></>);

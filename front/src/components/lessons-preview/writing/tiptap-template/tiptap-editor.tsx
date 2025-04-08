import { BlockEditor } from "./components/BlockEditor";

type TipTapEditorProps = {
  onCloseEditor: () => void;
};

const TipTapEditor = ({ onCloseEditor }: TipTapEditorProps) => {
  return <BlockEditor onCloseEditor={onCloseEditor} />;
};

export default TipTapEditor;

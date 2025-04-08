import { BubbleMenu, EditorProvider, FloatingMenu } from "@tiptap/react";
// import Document from "@tiptap/extension-document";
// import Paragraph from "@tiptap/extension-paragraph";
// import Text from "@tiptap/extension-text";
// import StarterKit from "@tiptap/starter-kit";
import { Camera, Code, Plus, Settings, Table, X } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { motion } from "framer-motion";

type TipTapActivityWritingProps = {
  onCloseTipTapEditor: () => void;
};

const TipTapActivityWriting = ({
  onCloseTipTapEditor,
}: TipTapActivityWritingProps) => {
  // const extensions = [StarterKit, Document, Paragraph, Text];
  const [title, setTitle] = useState<string>();
  // const [showFloatingMenu, setShowFloatingMenu] = useState(true);

  const onChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value);
  };

  const content = "";

  const editorProps = {
    attributes: {
      class:
        "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none",
    },
  };

  return (
    <div className="mt-4 flex flex-col gap-2">
      <button className="btn btn-sm self-end" onClick={onCloseTipTapEditor}>
        <X /> Annuler
      </button>

      {/* Editor */}
      <EditorProvider
        // extensions={extensions}
        content={content}
        autofocus
        editorProps={editorProps}
      >
        {/* New Line menu */}

        <FloatingMenu editor={null}>
          <motion.div
            className="w-max flex gap-5 items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-base-content">Commencer à écrire...</span>

            <div className="flex gap-2 bg-white shadow-lg rounded-lg p-2">
              <span className="flex gap-2 flex-wrap w-max-[35vw]">
                <button className="btn btn-sm">
                  <Camera /> Importer une photo
                </button>
                <button className="btn btn-sm">
                  <Code /> Insérer du code
                </button>
                <button className="btn btn-sm">
                  <Table /> Insérer un tableau
                </button>
              </span>
              <button
                className="btn btn-sm btn-link tooltip"
                data-tip="Personnaliser mes types de contenu"
              >
                <Plus />
              </button>
            </div>
          </motion.div>
        </FloatingMenu>

        {/* Selection menu */}
        <BubbleMenu
          className="w-max flex gap-5 bg-white shadow-lg rounded-lg p-2"
          editor={null}
        >
          <span className="flex gap-2">
            <button className="btn btn-sm font-bold">Bold</button>
            <button className="btn btn-sm italic">Italic</button>
          </span>
          <span className="flex gap-2">
            <button className="btn btn-sm">Titre 1</button>
            <button className="btn btn-sm">Titre 2</button>
            <button className="btn btn-sm">Titre 3</button>
            <button
              className="btn btn-sm btn-link tooltip"
              data-tip="Personnaliser les options de formatage"
            >
              <Plus />
            </button>
          </span>
        </BubbleMenu>

        {/* bottom menu */}
        <div className="mt-5 flex justify-between gap-5 bg-white shadow-lg rounded-lg p-2 mb-4">
          <span className="flex gap-4 items-center p-2">
            <button className="btn btn-sm">
              <Settings /> Personnaliser
            </button>
          </span>
          <span className="flex gap-4 items-center">
            <div className="flex gap-4 items-center">
              <span className="flex gap-2 items-center">
                <label className="label">Titre de l'activité</label>
                <input
                  value={title}
                  onChange={onChangeTitle}
                  type="text"
                  className="input input-bordered"
                  placeholder="obligatoire"
                />
              </span>
            </div>
            <button className="btn btn-success" disabled>
              Sauvegarder
            </button>
          </span>
        </div>
      </EditorProvider>
    </div>
  );
};

export default TipTapActivityWriting;

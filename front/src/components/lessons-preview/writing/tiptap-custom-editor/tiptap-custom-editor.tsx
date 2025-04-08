import StarterKit from "@tiptap/starter-kit";
import { EditorProvider } from "@tiptap/react";

// Custom implementation of the tiptap editor with Daisyui components
const TiptapCustomEditor = () => {
  const extensions = [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3],
      },
    }),
  ];

  const content = "";

  const editorProps = {
    attributes: {
      class:
        "prose max-w-full focus:outline-none hover:ring-2 hover:ring-primary/20 transition-all duration-200",
    },
  };

  return (
    <EditorProvider
      extensions={extensions}
      content={content}
      autofocus
      editorProps={editorProps}
    >
      {/* New Line menu */}

      {/* <FloatingMenu editor={null}>
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
      </FloatingMenu> */}

      {/* Selection menu */}
      {/* <BubbleMenu
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
      </BubbleMenu> */}
    </EditorProvider>
  );
};

export default TiptapCustomEditor;

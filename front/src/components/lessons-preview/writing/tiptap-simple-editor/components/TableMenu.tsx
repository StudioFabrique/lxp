import { Editor } from "@tiptap/react";
import { useCallback, useMemo } from "react";
import { Toolbar } from "./ui/Toolbar";
import { Icon } from "./ui/Icon";

interface TableMenuProps {
  editor: Editor;
}

export const TableMenu = ({ editor }: TableMenuProps) => {
  const isInTable = useMemo(() => editor.isActive("table"), [editor]);

  const tableCommands = useMemo(
    () => ({
      addColumnBefore: () => editor.chain().focus().addColumnBefore().run(),
      addColumnAfter: () => editor.chain().focus().addColumnAfter().run(),
      deleteColumn: () => editor.chain().focus().deleteColumn().run(),
      addRowBefore: () => editor.chain().focus().addRowBefore().run(),
      addRowAfter: () => editor.chain().focus().addRowAfter().run(),
      deleteRow: () => editor.chain().focus().deleteRow().run(),
      deleteTable: () => editor.chain().focus().deleteTable().run(),
      mergeCells: () => editor.chain().focus().mergeCells().run(),
      splitCell: () => editor.chain().focus().splitCell().run(),
      toggleHeaderColumn: () =>
        editor.chain().focus().toggleHeaderColumn().run(),
      toggleHeaderRow: () => editor.chain().focus().toggleHeaderRow().run(),
      toggleHeaderCell: () => editor.chain().focus().toggleHeaderCell().run(),
    }),
    [editor]
  );

  const canMergeCells = useCallback(() => {
    return editor.can().mergeCells();
  }, [editor]);

  const canSplitCell = useCallback(() => {
    return editor.can().splitCell();
  }, [editor]);

  if (!isInTable) {
    return null;
  }

  return (
    <div className="flex gap-1 p-2 bg-white border border-gray-200 rounded-lg shadow-lg">
      {/* Column operations */}
      <div className="flex gap-1 border-r border-gray-200 pr-2">
        <Toolbar.Button
          tooltip="Ajouter une colonne avant"
          onClick={tableCommands.addColumnBefore}
        >
          <Icon name="ArrowLeft" />
        </Toolbar.Button>
        <Toolbar.Button
          tooltip="Ajouter une colonne après"
          onClick={tableCommands.addColumnAfter}
        >
          <Icon name="ArrowRight" />
        </Toolbar.Button>
        <Toolbar.Button
          tooltip="Supprimer la colonne"
          onClick={tableCommands.deleteColumn}
          className="text-red-600 hover:text-red-700"
        >
          <Icon name="X" />
        </Toolbar.Button>
      </div>

      {/* Row operations */}
      <div className="flex gap-1 border-r border-gray-200 pr-2">
        <Toolbar.Button
          tooltip="Ajouter une ligne avant"
          onClick={tableCommands.addRowBefore}
        >
          <Icon name="ArrowUp" />
        </Toolbar.Button>
        <Toolbar.Button
          tooltip="Ajouter une ligne après"
          onClick={tableCommands.addRowAfter}
        >
          <Icon name="ArrowDown" />
        </Toolbar.Button>
        <Toolbar.Button
          tooltip="Supprimer la ligne"
          onClick={tableCommands.deleteRow}
          className="text-red-600 hover:text-red-700"
        >
          <Icon name="Minus" />
        </Toolbar.Button>
      </div>

      {/* Cell operations */}
      <div className="flex gap-1 border-r border-gray-200 pr-2">
        <Toolbar.Button
          tooltip="Fusionner les cellules"
          onClick={tableCommands.mergeCells}
          disabled={!canMergeCells()}
        >
          <Icon name="Combine" />
        </Toolbar.Button>
        <Toolbar.Button
          tooltip="Diviser la cellule"
          onClick={tableCommands.splitCell}
          disabled={!canSplitCell()}
        >
          <Icon name="Split" />
        </Toolbar.Button>
      </div>

      {/* Header toggles */}
      <div className="flex gap-1 border-r border-gray-200 pr-2">
        <Toolbar.Button
          tooltip="Activer/désactiver l'en-tête de colonne"
          onClick={tableCommands.toggleHeaderColumn}
          active={editor.isActive("tableHeader")}
        >
          <Icon name="Columns" />
        </Toolbar.Button>
        <Toolbar.Button
          tooltip="Activer/désactiver l'en-tête de ligne"
          onClick={tableCommands.toggleHeaderRow}
          active={editor.isActive("tableHeader")}
        >
          <Icon name="Rows" />
        </Toolbar.Button>
      </div>

      {/* Delete table */}
      <Toolbar.Button
        tooltip="Supprimer le tableau"
        onClick={tableCommands.deleteTable}
        className="text-red-600 hover:text-red-700"
      >
        <Icon name="Trash" />
      </Toolbar.Button>
    </div>
  );
};

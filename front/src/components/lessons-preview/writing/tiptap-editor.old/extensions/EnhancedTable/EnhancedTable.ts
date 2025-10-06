import { Table } from "@tiptap/extension-table";
import { Plugin, PluginKey } from "prosemirror-state";

export interface EnhancedTableOptions {
  HTMLAttributes: Record<string, unknown>;
  resizable: boolean;
  allowTableNodeSelection: boolean;
  cellMinWidth: number;
  View?: unknown;
  lastColumnResizable: boolean;
  handleWidth: number;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    enhancedTable: {
      insertTable: (options?: {
        rows?: number;
        cols?: number;
        withHeaderRow?: boolean;
        withHeaderColumn?: boolean;
      }) => ReturnType;
      addColumnBefore: () => ReturnType;
      addColumnAfter: () => ReturnType;
      deleteColumn: () => ReturnType;
      addRowBefore: () => ReturnType;
      addRowAfter: () => ReturnType;
      deleteRow: () => ReturnType;
      deleteTable: () => ReturnType;
      mergeCells: () => ReturnType;
      splitCell: () => ReturnType;
      setCellAttribute: (name: string, value: unknown) => ReturnType;
      goToNextCell: () => ReturnType;
      goToPreviousCell: () => ReturnType;
      toggleHeaderColumn: () => ReturnType;
      toggleHeaderRow: () => ReturnType;
      toggleHeaderCell: () => ReturnType;
    };
  }
}

const tableNavigationPlugin = new Plugin({
  key: new PluginKey("tableNavigation"),
  props: {
    handleKeyDown: (view, event) => {
      const { state } = view;
      const { selection } = state;

      // Check if we're in a table
      const table = selection.$from.node(-1);
      if (table?.type.name !== "table") {
        return false;
      }

      // Handle Tab navigation
      if (event.key === "Tab") {
        event.preventDefault();

        if (event.shiftKey) {
          // Go to previous cell
          return view.dispatch(state.tr);
        } else {
          // Go to next cell
          return view.dispatch(state.tr);
        }
      }

      // Handle Arrow key navigation
      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)
      ) {
        // Let TipTap handle arrow navigation in tables
        return false;
      }

      return false;
    },
  },
});

export const EnhancedTable = Table.extend<EnhancedTableOptions>({
  name: "enhancedTable",

  addOptions() {
    return {
      ...this.parent?.(),
      HTMLAttributes: {
        class: "tiptap-table",
      },
      resizable: true,
      allowTableNodeSelection: true,
      cellMinWidth: 50,
      lastColumnResizable: true,
      handleWidth: 5,
    };
  },

  addCommands() {
    return {
      ...this.parent?.(),
      insertTable:
        (options = {}) =>
        ({ commands }) => {
          const { rows = 3, cols = 3, withHeaderRow = true } = options;

          return commands.insertTable({
            rows,
            cols,
            withHeaderRow,
          });
        },

      // Enhanced navigation commands
      goToNextCell:
        () =>
        ({ commands }) => {
          return commands.goToNextCell();
        },

      goToPreviousCell:
        () =>
        ({ commands }) => {
          return commands.goToPreviousCell();
        },
    };
  },

  addProseMirrorPlugins() {
    return [...(this.parent?.() || []), tableNavigationPlugin];
  },

  addKeyboardShortcuts() {
    return {
      ...this.parent?.(),
      Tab: () => {
        if (this.editor.isActive("table")) {
          return this.editor.commands.goToNextCell();
        }
        return false;
      },
      "Shift-Tab": () => {
        if (this.editor.isActive("table")) {
          return this.editor.commands.goToPreviousCell();
        }
        return false;
      },
      // Add shortcuts for table operations
      "Mod-Shift-Backspace": () => {
        if (this.editor.isActive("table")) {
          return this.editor.commands.deleteTable();
        }
        return false;
      },
    };
  },
});

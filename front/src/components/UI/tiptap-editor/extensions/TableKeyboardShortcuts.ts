import { Extension } from "@tiptap/core";

export const TableKeyboardShortcuts = Extension.create({
  name: "tableKeyboardShortcuts",

  addKeyboardShortcuts() {
    return {
      // Navigation dans les tableaux
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

      // Raccourcis pour ajouter des lignes/colonnes
      "Mod-Shift-ArrowUp": () => {
        if (this.editor.isActive("table")) {
          return this.editor.commands.addRowBefore();
        }
        return false;
      },
      "Mod-Shift-ArrowDown": () => {
        if (this.editor.isActive("table")) {
          return this.editor.commands.addRowAfter();
        }
        return false;
      },
      "Mod-Shift-ArrowLeft": () => {
        if (this.editor.isActive("table")) {
          return this.editor.commands.addColumnBefore();
        }
        return false;
      },
      "Mod-Shift-ArrowRight": () => {
        if (this.editor.isActive("table")) {
          return this.editor.commands.addColumnAfter();
        }
        return false;
      },

      // Raccourcis pour supprimer
      "Mod-Shift-Backspace": () => {
        if (this.editor.isActive("table")) {
          return this.editor.commands.deleteTable();
        }
        return false;
      },
      "Mod-Backspace": () => {
        if (this.editor.isActive("table")) {
          // Try to delete row first, then column if row deletion fails
          if (this.editor.can().deleteRow()) {
            return this.editor.commands.deleteRow();
          } else if (this.editor.can().deleteColumn()) {
            return this.editor.commands.deleteColumn();
          }
        }
        return false;
      },

      // Raccourcis pour fusion/division de cellules
      "Mod-Shift-m": () => {
        if (this.editor.isActive("table") && this.editor.can().mergeCells()) {
          return this.editor.commands.mergeCells();
        }
        return false;
      },
      "Mod-Shift-s": () => {
        if (this.editor.isActive("table") && this.editor.can().splitCell()) {
          return this.editor.commands.splitCell();
        }
        return false;
      },

      // Raccourci pour insérer un tableau
      "Mod-Shift-t": () => {
        if (!this.editor.isActive("table")) {
          return this.editor.commands.insertTable({
            rows: 3,
            cols: 3,
            withHeaderRow: true,
          });
        }
        return false;
      },
    };
  },
});

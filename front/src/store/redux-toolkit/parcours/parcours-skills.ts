/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";

import Skill from "../../../utils/interfaces/skill";
import { addIdToObject } from "../../../utils/add-id-to-objects";

/**
 * État initial du store des compétences du parcours
 */
const initialParcoursState = {
  informationsAreValid: false,
  importedSkills: Array<any>(), // Compétences importées
  skills: Array<Skill>(), // Liste des compétences du parcours
};

/**
 * Slice Redux pour gérer les compétences du parcours
 */
const parcoursSkillsSlice = createSlice({
  name: "parcoursSkills",
  initialState: initialParcoursState,
  reducers: {
    /**
     * Ajoute une nouvelle compétence à la liste
     * @param state État actuel
     * @param action Action contenant la nouvelle compétence
     */
    addSkill(state, action) {
      const updatedSkills = state.skills;
      const skill = { ...action.payload, isBonus: true };
      updatedSkills.push(skill);
    },

    /**
     * Supprime une compétence de la liste
     * @param state État actuel
     * @param action Action contenant l'ID de la compétence à supprimer
     */
    deleteSkill(state, action) {
      const skillToDelete = action.payload;
      const updatedSkills = state.skills.filter(
        (item) => item.id !== skillToDelete
      );
      state.skills = updatedSkills;
    },

    /**
     * Met à jour une compétence existante
     * @param state État actuel
     * @param action Action contenant la compétence mise à jour
     */
    editSkill(state, action) {
      const newSkill = action.payload;

      let updatedSkills = state.skills;
      updatedSkills = updatedSkills.filter((item) => item.id !== newSkill.id);
      updatedSkills.push(newSkill);
    },

    /**
     * Définit la liste complète des compétences
     * @param state État actuel
     * @param action Action contenant la nouvelle liste de compétences
     */
    setSkillsList(state, action) {
      state.skills = action.payload.map((item: any) => ({
        ...item,
        isBonus: true,
      }));
    },

    /**
     * Importe une liste de compétences
     * @param state État actuel
     * @param action Action contenant les compétences à importer
     */
    importSkills(state, action) {
      state.importedSkills = addIdToObject(action.payload);
    },

    /**
     * Ajoute les compétences importées à la liste principale
     * @param state État actuel
     * @param action Action contenant les compétences à ajouter
     */
    addImportedSkillsToSkills(state, action) {
      let skills = state.skills;
      const newSkills = action.payload;
      newSkills.forEach((newSkill: any) => {
        const skill = skills.find(
          (item: any) => newSkill.description === item.description
        );
        if (!skill) {
          skills = [...skills, newSkill];
        }
      });
    },

    /**
     * Réinitialise l'état à ses valeurs par défaut
     * @param state État actuel
     */
    reset(state) {
      state.informationsAreValid = false;
      state.importedSkills = [];
      state.skills = [];
    },
  },
});

export const parcoursSkillsAction = parcoursSkillsSlice.actions;

export default parcoursSkillsSlice;

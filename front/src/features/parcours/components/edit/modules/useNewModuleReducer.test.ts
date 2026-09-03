import { describe, expect, it } from "vitest";

import type Contact from "../../../../../utils/interfaces/contact";
import type Skill from "../../../../../utils/interfaces/skill";
import type { ModuleData } from "../../../interfaces/new-module";
import {
  initialState,
  moduleReducer,
  withRequiredContact,
  withSelectedModuleAssociations,
} from "./useNewModuleReducer";

const contacts: Contact[] = [
  {
    id: 1,
    idMdb: "teacher-1",
    firstname: "Ressource",
    lastname: "pédagogique",
    role: "Formateur",
  },
];

const skills: Skill[] = [{ id: 2, description: "Compétence" }];

const moduleData: ModuleData = {
  id: 10,
  title: "Module",
  description: "Description",
  duration: 2,
  thumb: null,
  contacts: [],
  skills: [],
};

describe("moduleReducer", () => {
  it("préremplit la ressource pédagogique du formateur à la création", () => {
    const creationState = moduleReducer(initialState, {
      type: "START_CREATE",
      payload: contacts,
    });

    expect(creationState.currentContacts).toEqual(contacts);
  });

  it("réinsère la ressource pédagogique verrouillée si elle est retirée", () => {
    expect(withRequiredContact([], contacts[0])).toEqual(contacts);
  });

  it("rend immédiatement les associations sélectionnées après une création", () => {
    const createdModule = withSelectedModuleAssociations(moduleData, {
      contacts,
      skills,
    });
    const createdState = moduleReducer(initialState, {
      type: "MODULE_CREATED",
      payload: createdModule,
    });
    const editingState = moduleReducer(createdState, {
      type: "UPDATE_MODULE",
      payload: {
        id: createdModule.id,
        contacts: createdModule.contacts,
        skills: createdModule.skills,
        duration: createdModule.duration ?? 1,
      },
    });

    expect(editingState.currentContacts).toEqual(contacts);
    expect(editingState.currentSkills).toEqual(skills);
  });

  it("conserve ressources et compétences ensemble après une modification", () => {
    const stateWithModule = { ...initialState, modules: [moduleData] };
    const updatedModule = withSelectedModuleAssociations(
      { ...moduleData, title: "Module modifié" },
      { contacts, skills },
    );

    const updatedState = moduleReducer(stateWithModule, {
      type: "SUCCESSFUL_MODULE_UPDATE",
      payload: updatedModule,
    });

    expect(updatedState.modules[0]).toMatchObject({
      title: "Module modifié",
      contacts,
      skills,
    });
  });
});

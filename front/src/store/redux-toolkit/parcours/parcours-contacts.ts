import { createSlice } from "@reduxjs/toolkit";

import Contact from "../../../utils/interfaces/contact";
import { sortArray } from "../../../utils/sortArray";

const initialContactsState = {
  initialContacts: Array<Contact>(),
  currentContacts: Array<Contact>(),
  notSelectedContacts: Array<Contact>(),
  filteredContacts: Array<Contact>(),
};

const parcoursContactsSlice = createSlice({
  name: "parcoursContacts",
  initialState: initialContactsState,
  reducers: {
    initContacts(state, action) {
      state.initialContacts = action.payload;
    },
    setNotSelectedContacts(state) {
      const currentContacts = state.currentContacts;
      let notSelectedContacts = state.initialContacts;
      for (const currentContact of currentContacts) {
        notSelectedContacts = notSelectedContacts.filter(
          (notSelectedContact: Contact) =>
            notSelectedContact.idMdb !== currentContact.idMdb
        );
      }
      state.notSelectedContacts = notSelectedContacts;
    },
    setCurrentContacts(state, action) {
      state.currentContacts = action.payload;
    },
    filterContacts(state, action) {
      if (action.payload.length > 0) {
        state.filteredContacts = sortArray(
          state.notSelectedContacts.filter((item: Contact) =>
            item.name
              .toLocaleLowerCase()
              .includes(action.payload.toLocaleLowerCase())
          ),
          "name"
        );
      }
    },
    addContact(state, action) {
      const contactId = action.payload;
      const contact = state.notSelectedContacts.find(
        (item: Contact) => item.idMdb === contactId
      );
      if (contact) {
        state.currentContacts.push(contact);
        sortArray(state.currentContacts, "name");
      }
    },
    removeTag(state, action) {
      const contactId = action.payload;
      state.currentContacts = state.currentContacts.filter(
        (item: Contact) => item.idMdb !== contactId
      );
    },
    addNewContact(state, action) {
      const user = action.payload;
      state.initialContacts.push({
        idMdb: user._id,
        name: `${user.firstname} ${user.lastname}`,
        role: user.roles[0].label,
      });
      state.initialContacts = sortArray(state.initialContacts, "name");
      console.log(state.initialContacts);
    },
    reset(state) {
      state.initialContacts = [];
      state.currentContacts = [];
      state.notSelectedContacts = [];
      state.filteredContacts = [];
    },
    resetFilter(state) {
      state.filteredContacts = [];
    },
  },
});

export const parcoursContactsAction = parcoursContactsSlice.actions;

export default parcoursContactsSlice;

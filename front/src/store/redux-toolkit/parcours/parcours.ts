import { createSlice } from "@reduxjs/toolkit";

const initialParcoursState = {
  id: null,
  image: null,
};

const parcoursSlice = createSlice({
  name: "parcours",
  initialState: initialParcoursState,
  reducers: {},
});

export const parcoursAction = parcoursSlice.actions;

export default parcoursSlice;

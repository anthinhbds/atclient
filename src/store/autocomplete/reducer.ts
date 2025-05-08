/** @format */
import { createSlice } from "@reduxjs/toolkit";

interface IRecord {
  code: string;
  name: string;
}

interface IAutocompleteState {
  data: IRecord[];
}
// // TODO: Store design
const initialState: IAutocompleteState = {
  data: [],
};
const slice = createSlice({
  name: "autocomplete",
  initialState: initialState,
  reducers: {
    addRecordRequest: (
      state,
      data: { payload: { formId: string; record: IRecord[] } }
    ) => {
      const { formId, record } = data.payload;
      return {
        ...state,
        [`data_${formId}`]: record,
      };
    },
  },
});

const { actions, reducer } = slice;
const { addRecordRequest } = actions;

export { addRecordRequest };
export type { IAutocompleteState };
export default reducer;

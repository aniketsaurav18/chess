import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { DEFAULT_ENGINE_CONFIG } from "../../../utils/config";

export const engineConfiguration = createSlice({
  initialState: DEFAULT_ENGINE_CONFIG,
  name: "engine-configuration",
  reducers: {
    changeConfiguration: (
      state,
      action: PayloadAction<typeof DEFAULT_ENGINE_CONFIG>
    ) => {
      Object.assign(state, action.payload);
    },
  },
});

export const { changeConfiguration } = engineConfiguration.actions;
export default engineConfiguration.reducer;

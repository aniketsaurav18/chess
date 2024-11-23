import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { DEFAULT_ENGINE_CONFIG } from "../../../utils/config";

interface EngineState {
  configuration: typeof DEFAULT_ENGINE_CONFIG;
  status: "ready" | "not-ready" | "loading";
}

const initialState: EngineState = {
  configuration: DEFAULT_ENGINE_CONFIG,
  status: "not-ready",
};

export const engineSlice = createSlice({
  initialState,
  name: "engine configuration",
  reducers: {
    changeConfiguration: (
      state,
      action: PayloadAction<typeof DEFAULT_ENGINE_CONFIG>
    ) => {
      state.configuration = action.payload;
    },
    updateStatus: (state, action: PayloadAction<EngineState["status"]>) => {
      state.status = action.payload;
    },
  },
});

export const { changeConfiguration, updateStatus } = engineSlice.actions;
export default engineSlice.reducer;

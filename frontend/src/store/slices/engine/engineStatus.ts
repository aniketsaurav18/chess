import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface EngineStatusState {
  status: "ready" | "not-ready" | "loading";
}

const initialState: EngineStatusState = {
  status: "not-ready",
};

export const engineStatusSlice = createSlice({
  initialState,
  name: "engine-status",
  reducers: {
    updateStatus: (
      state,
      action: PayloadAction<EngineStatusState["status"]>
    ) => {
      state.status = action.payload;
    },
  },
});

export const { updateStatus } = engineStatusSlice.actions;
export default engineStatusSlice.reducer;

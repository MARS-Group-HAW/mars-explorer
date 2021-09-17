import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SimulationStates } from "@shared/types/SimulationStates";
import type { RootState } from "../../../utils/store";

// Define a type for the slice state
type SimulationState = {
  simulationState: SimulationStates;
};

// Define the initial state using that type
const initialState: SimulationState = {
  simulationState: SimulationStates.NONE,
};

export const simulationSlice = createSlice({
  name: "simulation",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setSimulationState: (state, action: PayloadAction<SimulationStates>) => {
      state.simulationState = action.payload;
    },
  },
});

export const { setSimulationState } = simulationSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectSimulationState = (state: RootState) =>
  state.simulation.simulationState;
export const selectHasSimulationFinished = (state: RootState) =>
  state.simulation.simulationState === SimulationStates.SUCCESS;

export default simulationSlice.reducer;

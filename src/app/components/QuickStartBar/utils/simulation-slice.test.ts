import { SimulationStates } from "@shared/types/SimulationStates";
import {
  SimulationCountMessage,
  SimulationVisMessage,
} from "@shared/types/SimulationMessages";
import { ObjectCoordinate } from "@shared/types/ObjectData";
import { initialState, simulationSlice } from "./simulation-slice";
import { ResultData } from "../../Analyze/utils/ResultData";
import { SimulationState } from "./types";

const { reducer, actions } = simulationSlice;

const initState = initialState;

describe("simulation-slice", () => {
  describe("actions", () => {
    test("should reset results if state changes to STARTED", () => {
      const stateWithResult: SimulationState = {
        maxProgress: 10,
        simulationState: SimulationStates.SUCCESS,
        resultData: [
          {
            name: "Wolf",
            hasCompleted: true,
            isLoading: false,
            hasBeenRestored: false,
            data: [
              {
                progress: 0,
                count: 2,
              },
              {
                progress: 1,
                count: 10,
              },
            ],
          },
        ],
      };

      const startedState = reducer(
        stateWithResult,
        actions.setSimulationState(SimulationStates.STARTED)
      );

      expect(startedState.maxProgress).toBe(0);
      expect(startedState.simulationState).toBe(SimulationStates.STARTED);
      expect(startedState.resultData).toEqual([
        {
          name: "Wolf",
          hasCompleted: false,
          isLoading: false,
          hasBeenRestored: false,
          data: [],
        },
      ]);
    });

    test("should update progress on any new message", () => {
      const currentState: SimulationState = {
        maxProgress: 1,
        simulationState: SimulationStates.RUNNING,
        resultData: [],
      };

      const sampleCountMessage: SimulationCountMessage = {
        progress: 2,
        objectCounts: [],
      };

      expect(
        reducer(currentState, actions.addCountData(sampleCountMessage))
          .maxProgress
      ).toBe(2);

      const sampleVisMessage: SimulationVisMessage = {
        progress: 50,
        objectCoords: { name: "Wolf", coords: [] },
      };

      expect(
        reducer(currentState, actions.addPosData(sampleVisMessage)).maxProgress
      ).toBe(50);
    });

    test("should update state on any new message", () => {
      const currentState: SimulationState = {
        simulationState: SimulationStates.STARTED,
        resultData: [],
      };

      const sampleCountMessage: SimulationCountMessage = {
        progress: 1,
        objectCounts: [],
      };

      expect(
        reducer(currentState, actions.addCountData(sampleCountMessage))
          .simulationState
      ).toBe(SimulationStates.RUNNING);

      const sampleVisMessage: SimulationVisMessage = {
        progress: 50,
        objectCoords: { name: "Wolf", coords: [] },
      };

      expect(
        reducer(currentState, actions.addPosData(sampleVisMessage))
          .simulationState
      ).toBe(SimulationStates.RUNNING);
    });

    test("should correctly map result of count message to store", () => {
      const sampleCountData: SimulationCountMessage = {
        progress: 1,
        objectCounts: [
          {
            name: "Wolf",
            count: 10,
          },
        ],
      };

      const expectedResult: ResultData = [
        {
          name: "Wolf",
          hasBeenRestored: false,
          isLoading: true,
          hasCompleted: false,
          data: [
            {
              progress: 1,
              count: 10,
            },
          ],
        },
      ];

      const newState = reducer(
        initState,
        actions.addCountData(sampleCountData)
      );

      expect(newState.resultData).toEqual(expectedResult);
    });

    test("should correctly append result of count message", () => {
      const sampleCountData: SimulationCountMessage = {
        progress: 2,
        objectCounts: [
          {
            name: "Wolf",
            count: 20,
          },
        ],
      };

      const expectedResult: ResultData = [
        {
          name: "Wolf",
          hasBeenRestored: false,
          isLoading: true,
          hasCompleted: false,
          data: [
            {
              progress: 1,
              count: 10,
            },
            {
              progress: 2,
              count: 20,
            },
          ],
        },
      ];

      const newState = reducer(
        {
          maxProgress: 1,
          simulationState: SimulationStates.RUNNING,
          resultData: [
            {
              name: "Wolf",
              hasCompleted: false,
              isLoading: true,
              hasBeenRestored: false,
              data: [
                {
                  progress: 1,
                  count: 10,
                },
              ],
            },
          ],
        },
        actions.addCountData(sampleCountData)
      );

      expect(newState.resultData).toEqual(expectedResult);
    });

    test("should correctly add new object to count results", () => {
      const currentState: SimulationState = {
        maxProgress: 1,
        simulationState: SimulationStates.RUNNING,
        resultData: [
          {
            name: "Wolf",
            hasCompleted: false,
            isLoading: true,
            hasBeenRestored: false,
            data: [
              {
                progress: 1,
                count: 10,
              },
            ],
          },
        ],
      };

      const sampleCountData: SimulationCountMessage = {
        progress: 1,
        objectCounts: [
          {
            name: "Sheep",
            count: 100,
          },
        ],
      };

      const expectedResult: ResultData = [
        ...currentState.resultData,
        {
          name: "Sheep",
          hasBeenRestored: false,
          isLoading: true,
          hasCompleted: false,
          data: [
            {
              progress: 1,
              count: 100,
            },
          ],
        },
      ];

      const newState = reducer(
        currentState,
        actions.addCountData(sampleCountData)
      );

      expect(newState.resultData).toEqual(expectedResult);
    });

    test("should correctly map result of vis message to store", () => {
      const wolfCoords: ObjectCoordinate = { x: 1, y: 1, count: 1 };

      const sampleVisMessage: SimulationVisMessage = {
        progress: 1,
        objectCoords: {
          name: "Wolf",
          coords: [wolfCoords],
        },
      };

      const expectedResult: ResultData = [
        {
          name: "Wolf",
          hasBeenRestored: false,
          isLoading: true,
          hasCompleted: false,
          data: [
            {
              progress: 1,
              coords: [wolfCoords],
            },
          ],
        },
      ];

      const newState = reducer(initState, actions.addPosData(sampleVisMessage));

      expect(newState.resultData).toEqual(expectedResult);
    });

    test("should correctly append result of vis message", () => {
      const wolfCoords: ObjectCoordinate = { x: 3, y: 3, count: 3 };

      const sampleVisMessage: SimulationVisMessage = {
        progress: 2,
        objectCoords: {
          name: "Wolf",
          coords: [wolfCoords],
        },
      };

      const expectedResult: ResultData = [
        {
          name: "Wolf",
          hasBeenRestored: false,
          isLoading: true,
          hasCompleted: false,
          data: [
            {
              progress: 1,
              coords: [{ x: 1, y: 1, count: 1 }],
            },
            {
              progress: 2,
              coords: [wolfCoords],
            },
          ],
        },
      ];

      const newState = reducer(
        {
          maxProgress: 2,
          simulationState: SimulationStates.RUNNING,
          resultData: [
            {
              name: "Wolf",
              hasCompleted: false,
              isLoading: true,
              hasBeenRestored: false,
              data: [
                {
                  progress: 1,
                  coords: [{ x: 1, y: 1, count: 1 }],
                },
              ],
            },
          ],
        },
        actions.addPosData(sampleVisMessage)
      );

      expect(newState.maxProgress).toBe(2);
      expect(newState.simulationState).toBe(SimulationStates.RUNNING);
      expect(newState.resultData).toEqual(expectedResult);
    });

    test("should correctly add new object to pos results", () => {
      const currentState: SimulationState = {
        maxProgress: 1,
        simulationState: SimulationStates.RUNNING,
        resultData: [
          {
            name: "Wolf",
            hasCompleted: false,
            isLoading: true,
            hasBeenRestored: false,
            data: [
              {
                progress: 1,
                coords: [{ x: 1, y: 1, count: 1 }],
              },
            ],
          },
        ],
      };

      const sampleVisData: SimulationVisMessage = {
        progress: 2,
        objectCoords: {
          name: "Sheep",
          coords: [{ x: 20, y: 30, count: 40 }],
        },
      };

      const expectedResult: ResultData = [
        ...currentState.resultData,
        {
          name: "Sheep",
          hasBeenRestored: false,
          isLoading: true,
          hasCompleted: false,
          data: [
            {
              progress: 2,
              coords: [
                {
                  x: 20,
                  y: 30,
                  count: 40,
                },
              ],
            },
          ],
        },
      ];

      const newState = reducer(currentState, actions.addPosData(sampleVisData));

      expect(newState.resultData).toEqual(expectedResult);
    });

    test("should not overwrite count result if vis message comes in", () => {
      const sampleVisMessage: SimulationVisMessage = {
        progress: 1,
        objectCoords: {
          name: "Wolf",
          coords: [{ x: 3, y: 3, count: 3 }],
        },
      };

      const expectedResult: ResultData = [
        {
          name: "Wolf",
          hasBeenRestored: false,
          isLoading: true,
          hasCompleted: false,
          data: [
            {
              progress: 1,
              count: 20,
              coords: [{ x: 3, y: 3, count: 3 }],
            },
          ],
        },
      ];

      const newState = reducer(
        {
          maxProgress: 1,
          simulationState: SimulationStates.RUNNING,
          resultData: [
            {
              name: "Wolf",
              hasBeenRestored: false,
              isLoading: true,
              hasCompleted: false,
              data: [
                {
                  progress: 1,
                  count: 20,
                },
              ],
            },
          ],
        },
        actions.addPosData(sampleVisMessage)
      );

      expect(newState.resultData).toEqual(expectedResult);
    });

    test("should not overwrite vis result if count message comes in", () => {
      const sampleCountMessage: SimulationCountMessage = {
        progress: 1,
        objectCounts: [
          {
            name: "Wolf",
            count: 10,
          },
        ],
      };

      const expectedResult: ResultData = [
        {
          name: "Wolf",
          hasBeenRestored: false,
          isLoading: true,
          hasCompleted: false,
          data: [
            {
              progress: 1,
              count: 10,
              coords: [{ x: 3, y: 3, count: 3 }],
            },
          ],
        },
      ];

      const newState = reducer(
        {
          maxProgress: 1,
          simulationState: SimulationStates.RUNNING,
          resultData: [
            {
              name: "Wolf",
              hasBeenRestored: false,
              isLoading: true,
              hasCompleted: false,
              data: [
                {
                  progress: 1,
                  coords: [{ x: 3, y: 3, count: 3 }],
                },
              ],
            },
          ],
        },
        actions.addCountData(sampleCountMessage)
      );

      expect(newState.resultData).toEqual(expectedResult);
    });
  });
});

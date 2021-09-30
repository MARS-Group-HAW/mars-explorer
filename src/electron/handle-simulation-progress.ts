import WS from "ws";
import ReconnectingWebSocket, { Options } from "reconnecting-websocket";
import { Logger } from "./logger";
import {
  InputObjectCoordinates,
  InputObjectCounts,
  ObjectResultsMap,
} from "@shared/types/ObjectData";
import { SimulationProgressMessage } from "@shared/types/SimulationMessages";

export enum WebSocketCloseCodes {
  RETRYING = 1000,
  EXITING = 4000,
}

type ProgressMessage = {
  currentDateTime: string;
  currentStep: number;
  maxTicks: number;
  currentTick: number;
  progressInPercentage: number;
  isTimeReferenced: boolean;
  oneTickTimeSpan: string;
  startTimePoint: string;
  endTimePoint: string;
  isFinished: boolean;
  isInitialized: boolean;
  isPaused: boolean;
  isAborted: boolean;
  iterations: number;
  lastSuccessfullyDateTime: string;
  lastSuccessfullyStep: number;
  lastSuccessfullyTick: number;
  objectCounts: InputObjectCounts;
  objectCoordinates: InputObjectCoordinates;
};

export function handleSimulationProgress(
  log: Logger,
  onProgress: (progress: SimulationProgressMessage) => void,
  onMaxRetries: () => void
): () => void {
  const options: Options = {
    WebSocket: WS, // custom WebSocket constructor
    maxRetries: 50,
    connectionTimeout: 1000,
  };
  const rws = new ReconnectingWebSocket(
    "ws://127.0.0.1:4567/progress",
    [],
    options
  );

  rws.onopen = () => log.info("WebSocket for Simulation opened.");

  let lastProgress: number;

  rws.onmessage = (msg: MessageEvent<string>) => {
    const { currentTick, maxTicks, objectCounts, objectCoordinates } =
      JSON.parse(msg.data) as ProgressMessage;
    const progress = Math.floor((currentTick / maxTicks) * 100);

    if (lastProgress === undefined || lastProgress < progress) {
      log.debug(
        `Simulation-Progress: ${currentTick} von ${maxTicks} (${progress}%)`
      );

      const results: ObjectResultsMap = {};
      const objCountKeys = Object.keys(objectCounts);
      objCountKeys.forEach((key) => {
        results[key] = {
          coords: objectCoordinates[key],
          count: objectCounts[key],
        };
      });

      onProgress({
        progress,
        results,
      });
      lastProgress = progress;
    }
  };
  rws.onclose = (msg) => {
    if (rws.retryCount === options.maxRetries) {
      log.warn(
        "Could not connect to the simulation process. Exiting the simulation. Is the 'console' flag set in the config.json?"
      );
      onMaxRetries();
      return;
    }

    // see codes at https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/code
    switch (msg.code) {
      case WebSocketCloseCodes.RETRYING:
        log.info("Could not connect to WebSocket. Retrying ...");
        break;
      case WebSocketCloseCodes.EXITING:
        log.info("WebSocket closed by simulation end.");
        break;
    }
  };
  return () => rws.close(WebSocketCloseCodes.EXITING);
}

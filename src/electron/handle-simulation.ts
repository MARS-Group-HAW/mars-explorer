import ReconnectingWebSocket, {
  CloseEvent,
  Options,
} from "reconnecting-websocket";
import WS from "ws";
import { ObjectCounts } from "@shared/types/ObjectData";
import { ILogger } from "@shared/types/Logger";
import {
  SimulationCountMessage,
  SimulationVisMessage,
  SimulationWorldSizeMessage,
} from "@shared/types/SimulationMessages";

export enum WebSocketCloseCodes {
  RETRYING = 1000,
  EXITING = 4000,
  TERMINATED,
}

type CountWebsocketMessage = {
  maxTicks: number;
  currentTick: number;
  typeMetadata?: ObjectCounts;
};

type VisWebsocketMessage = {
  currentTick: number;
  typeName: string;
  entities: {
    x: number;
    y: number;
  }[];
  worldSize?: { minX: number; minY: number; maxX: number; maxY: number };
};

const options: Options = {
  WebSocket: WS, // custom WebSocket constructor
  maxRetries: 4000,
  maxReconnectionDelay: 100,
};

type Props = {
  log: ILogger;
  handleCountMsg: (countMsg: SimulationCountMessage | null) => void;
  handleVisMsg: (visMsg: SimulationVisMessage | null) => void;
  handleWorldSizeMsg: (msg: SimulationWorldSizeMessage | null) => void;
  handleMaxRetries: () => void;
};

class SimulationHandler {
  private static readonly SOCKET_ADDRESS = "ws://127.0.0.1:4567";

  private logger: ILogger;

  private countSocket: ReconnectingWebSocket;

  private visSocket: ReconnectingWebSocket;

  private countProgress: number;

  private visProgress = new Map<string, number>();

  private maxTicks: number;

  constructor({
    log,
    handleCountMsg,
    handleVisMsg,
    handleMaxRetries,
    handleWorldSizeMsg,
  }: Props) {
    this.logger = log;
    this.countSocket = new ReconnectingWebSocket(
      `${SimulationHandler.SOCKET_ADDRESS}/progress`,
      [],
      options
    );
    this.visSocket = new ReconnectingWebSocket(
      `${SimulationHandler.SOCKET_ADDRESS}/vis`,
      [],
      options
    );

    this.countSocket.onopen = () => log.info("WebSocket (Count) opened.");
    this.visSocket.onopen = () => log.info("WebSocket (Vis) opened.");

    this.countSocket.onmessage = (msg) =>
      handleCountMsg(this.handleCountMsg(msg));
    this.visSocket.onmessage = (msg) =>
      handleVisMsg(this.handleVisMsg(msg, handleWorldSizeMsg));

    try {
      this.countSocket.onclose = this.handleCountClose;
      this.visSocket.onclose = this.handleVisClose;
    } catch (e: any) {
      handleMaxRetries();
    }
  }

  public closeSockets = (code?: WebSocketCloseCodes) => {
    this.countSocket.close(code);
    this.visSocket.close(code);
  };

  private static parseMsg = <T>(msg: MessageEvent<string>): T =>
    JSON.parse(msg.data) as T;

  private calcProgress = (currentTick: number) => {
    const progress = Math.floor((currentTick / this.maxTicks) * 100);

    return Number.isNaN(progress) ? 0 : progress;
  };

  private isNewProgress = (progress: number, lastProgress?: number) =>
    lastProgress === undefined || lastProgress < progress;

  private handleCountMsg = (
    msg: MessageEvent<string>
  ): SimulationCountMessage | null => {
    const { currentTick, maxTicks, typeMetadata } =
      SimulationHandler.parseMsg<CountWebsocketMessage>(msg);

    if (!this.maxTicks) {
      this.maxTicks = maxTicks;
    }

    const progress = this.calcProgress(currentTick);

    if (this.isNewProgress(progress, this.countProgress)) {
      this.logger.debug(
        `Simulation-Progress: ${currentTick} von ${this.maxTicks} (${progress}%)`
      );

      const results: SimulationCountMessage["objectCounts"] = [];

      if (typeMetadata) {
        typeMetadata.forEach(({ name, count }) => {
          results.push({
            name,
            count,
          });
        });
      }

      this.countProgress = progress;

      return {
        progress,
        objectCounts: results,
      };
    }

    return null;
  };

  private handleVisMsg = (
    msg: MessageEvent<string>,
    handleWorldSizeMsg: Props["handleWorldSizeMsg"]
  ): SimulationVisMessage | null => {
    const { currentTick, typeName, entities, worldSize } =
      SimulationHandler.parseMsg<VisWebsocketMessage>(msg);

    const progress = this.calcProgress(currentTick);

    const progressOfType = this.visProgress.get(typeName);

    if (worldSize) {
      handleWorldSizeMsg({ worldSizes: worldSize });
    }

    if (
      this.isNewProgress(progress, progressOfType) &&
      entities &&
      entities.length > 0
    ) {
      const coords: SimulationVisMessage["objectCoords"]["coords"] = [];
      entities.forEach(({ x, y }) => {
        const found = coords.find((coord) => coord.x === x && coord.y === y);

        if (found) {
          found.count += 1;
        } else {
          coords.push({
            x,
            y,
            count: 1,
          });
        }
      });

      this.visProgress.set(typeName, progress);

      return {
        progress,
        objectCoords: {
          name: typeName,
          coords,
        },
      };
    }

    return null;
  };

  private handleCountClose = (msg: CloseEvent) =>
    this.handleClose(msg, this.countSocket.retryCount);

  private handleVisClose = (msg: CloseEvent) =>
    this.handleClose(msg, this.visSocket.retryCount);

  private handleClose = (evt: CloseEvent, retryCount: number) => {
    if (retryCount === options.maxRetries) {
      this.logger.warn(
        "Could not connect to the simulation process. Exiting the simulation. Is the 'console' flag set in the config.json?"
      );
      throw new Error("Max retries for reconnecting websocket reached.");
    }

    // see codes at https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/code
    switch (evt.code) {
      case WebSocketCloseCodes.RETRYING:
        if (retryCount <= 1) {
          this.logger.info("Could not connect to WebSocket. Retrying ...");
        }
        break;
      case WebSocketCloseCodes.EXITING:
        this.logger.info("WebSocket closed by simulation end.");
        break;
      case WebSocketCloseCodes.TERMINATED:
        this.logger.info("WebSocket closed because of termination.");
        break;
      default:
        this.logger.info("WebSocket closed for unknown reason.");
    }
  };
}

export default SimulationHandler;

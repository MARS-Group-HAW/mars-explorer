import ReconnectingWebSocket, {
  CloseEvent,
  Options,
} from "reconnecting-websocket";
import WS from "ws";
import log from "./main-logger";

export enum WebSocketCloseCodes {
  RETRYING = 1000,
  TERMINATED = 1006,
  EXITING = 4000,
}

const options: Options = {
  WebSocket: WS, // custom WebSocket constructor
  maxRetries: 6000,
  maxReconnectionDelay: 10,
};

export enum MarsFrameworkSockets {
  COUNT = "progress",
  VIS = "vis",
}

type Props = {
  marsSocket: MarsFrameworkSockets;
  handleMaxRetries: () => void;
};

abstract class SimulationHandler<OutputMessage> {
  private static readonly SOCKET_ADDRESS = "ws://127.0.0.1:4567";

  protected readonly socket: ReconnectingWebSocket;

  private readonly marsSocket: MarsFrameworkSockets;

  protected static maxTicks?: number;

  protected constructor({ marsSocket, handleMaxRetries }: Props) {
    SimulationHandler.maxTicks = undefined;
    this.marsSocket = marsSocket;
    this.socket = new ReconnectingWebSocket(
      `${SimulationHandler.SOCKET_ADDRESS}/${marsSocket}`,
      [],
      options
    );

    this.socket.onopen = this.handleOpen;
    this.socket.onmessage = this.handleMessage;

    try {
      this.socket.onclose = this.handleClose;
    } catch (e: any) {
      log.error(
        `An error occurred while closing the websocket (${marsSocket}):`,
        e
      );
      handleMaxRetries();
    }
  }

  protected abstract handleMessage(message: MessageEvent): OutputMessage;

  private handleOpen = () => log.info(`WebSocket (${this.marsSocket}) opened.`);

  public close = (code?: WebSocketCloseCodes) => {
    if (Number.isInteger(code)) {
      this.socket.close(code);
    } else {
      this.socket.close();
    }
  };

  protected static parseMsg = <T>(msg: MessageEvent<string>): T =>
    JSON.parse(msg.data) as T;

  protected calcProgress = (currentTick: number) => {
    const progress = Math.floor(
      (currentTick / SimulationHandler.maxTicks) * 100
    );

    return Number.isNaN(progress) || !Number.isFinite(progress) ? 0 : progress;
  };

  protected isNewProgress = (progress: number, lastProgress?: number) =>
    lastProgress === undefined ||
    lastProgress === null ||
    lastProgress < progress;

  private handleClose = (evt: CloseEvent) => {
    const { retryCount } = this.socket;

    if (retryCount === options.maxRetries) {
      log.warn(
        `Could not connect to the websocket (${this.marsSocket}) of the simulation process. Exiting the simulation. Is the 'console' flag set in the config.json?`
      );
      throw new Error(
        `Max retries for reconnecting websocket (${this.marsSocket}) reached.`
      );
    }

    // see codes at https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/code
    switch (evt.code) {
      case WebSocketCloseCodes.RETRYING:
        if (retryCount === 1 || retryCount % 10 === 0) {
          log.info(
            `Trying to connect to WebSocket (${this.marsSocket}) ... (count: ${retryCount})`
          );
        }
        break;
      case WebSocketCloseCodes.EXITING:
        log.info(`WebSocket (${this.marsSocket}) closed by simulation end.`);
        break;
      case WebSocketCloseCodes.TERMINATED:
        log.info(
          `WebSocket (${this.marsSocket}) closed because of termination.`
        );
        break;
      default:
        log.info(`WebSocket (${this.marsSocket}) closed for unknown reason.`);
    }
  };
}

export default SimulationHandler;

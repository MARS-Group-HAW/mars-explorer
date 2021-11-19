import {
  SimulationVisMessage,
  SimulationWorldSizeMessage,
} from "@shared/types/SimulationMessages";
import SimulationHandler, { MarsFrameworkSockets } from "./handle-simulation";

type VisWebsocketMessage = {
  currentTick: number;
  typeName: string;
  entities: {
    x: number;
    y: number;
  }[];
  worldSize?: { minX: number; minY: number; maxX: number; maxY: number };
};

type MaybeMessage = SimulationVisMessage | SimulationWorldSizeMessage | null;

type Props = {
  handleVisMsg: (visMsg: SimulationVisMessage | null) => void;
  handleWorldSizeMsg: (msg: SimulationWorldSizeMessage | null) => void;
  handleMaxRetries: () => void;
};

class SimulationVisHandler extends SimulationHandler<MaybeMessage> {
  private visProgress = new Map<string, number>();

  constructor({ handleVisMsg, handleMaxRetries, handleWorldSizeMsg }: Props) {
    super({
      marsSocket: MarsFrameworkSockets.VIS,
      handleMaxRetries,
    });
    this.socket.onmessage = (msg) => {
      const message: MaybeMessage = this.handleMessage(msg);

      if (message === null) return;

      if (SimulationVisHandler.isWorldSizeMessage(message)) {
        handleWorldSizeMsg(message);
      } else {
        handleVisMsg(message);
      }
    };
  }

  private static isWorldSizeMessage(
    message: SimulationVisMessage | SimulationWorldSizeMessage
  ): message is SimulationWorldSizeMessage {
    return (<SimulationWorldSizeMessage>message).worldSizes !== undefined;
  }

  protected handleMessage(message: MessageEvent): MaybeMessage {
    const { currentTick, typeName, entities, worldSize } =
      SimulationHandler.parseMsg<VisWebsocketMessage>(message);

    if (worldSize) {
      return { worldSizes: worldSize };
    }

    if (!currentTick || !typeName || !entities || entities?.length === 0)
      return null;

    const progress = this.calcProgress(currentTick);

    const progressOfType = this.visProgress.get(typeName);

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
  }
}

export default SimulationVisHandler;

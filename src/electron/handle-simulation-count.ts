import { ObjectCounts } from "@shared/types/ObjectData";
import { SimulationCountMessage } from "@shared/types/SimulationMessages";
import log from "./main-logger";
import SimulationHandler, { MarsFrameworkSockets } from "./handle-simulation";

type CountWebsocketMessage = {
  maxTicks: number;
  currentTick: number;
  typeMetadata?: ObjectCounts;
};

type MaybeMessage = SimulationCountMessage | null;

type Props = {
  handleCountMsg: (countMsg: MaybeMessage) => void;
  handleMaxRetries: () => void;
};

class SimulationCountHandler extends SimulationHandler<MaybeMessage> {
  private countProgress: number;

  constructor({ handleCountMsg, handleMaxRetries }: Props) {
    super({
      marsSocket: MarsFrameworkSockets.COUNT,
      handleMaxRetries,
    });
    this.socket.onmessage = (msg) => handleCountMsg(this.handleMessage(msg));
  }

  protected handleMessage(
    msg: MessageEvent<string>
  ): SimulationCountMessage | null {
    const { currentTick, maxTicks, typeMetadata } =
      SimulationHandler.parseMsg<CountWebsocketMessage>(msg);

    if (!SimulationHandler.maxTicks) {
      SimulationHandler.maxTicks = maxTicks;
    }

    const progress = this.calcProgress(currentTick);

    if (this.isNewProgress(progress, this.countProgress)) {
      log.debug(
        `Simulation-Progress: ${currentTick} von ${SimulationHandler.maxTicks} (${progress}%)`
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
  }
}

export default SimulationCountHandler;

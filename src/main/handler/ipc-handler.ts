import { ipcMain, IpcMainEvent, IpcMainInvokeEvent } from "electron";
import {
  Channel,
  ChannelInputMap,
  ChannelOutputMap,
} from "@shared/types/Channel";
import log from "../main-logger";
import main from "../main";

abstract class IpcHandler {
  protected logger = log;

  public constructor() {
    this.registerHandler();
  }

  protected abstract registerHandler(): void;

  // eslint-disable-next-line class-methods-use-this
  protected handle<Ch extends Channel>(
    channel: Ch,
    listener: (
      event: IpcMainInvokeEvent,
      args: ChannelInputMap[Ch]
    ) => ChannelOutputMap[Ch] | Promise<ChannelOutputMap[Ch]>
  ): void {
    return ipcMain.handle(channel, listener);
  }

  // eslint-disable-next-line class-methods-use-this
  protected on<Ch extends Channel>(
    channel: Ch,
    listener: (event: IpcMainEvent, args: ChannelInputMap[Ch]) => void
  ): Electron.IpcMain {
    return ipcMain.on(channel, listener);
  }

  // eslint-disable-next-line class-methods-use-this
  protected once<Ch extends Channel>(
    channel: Ch,
    listener: (event: IpcMainEvent, args: ChannelInputMap[Ch]) => void
  ): Electron.IpcMain {
    return ipcMain.once(channel, listener);
  }

  // eslint-disable-next-line class-methods-use-this
  protected send<Ch extends Channel>(channel: Ch, args?: ChannelOutputMap[Ch]) {
    return main.window.webContents.send(channel, args);
  }

  // eslint-disable-next-line class-methods-use-this
  protected removeHandler<Ch extends Channel>(channel: Ch) {
    return ipcMain.removeHandler(channel);
  }
}

export default IpcHandler;

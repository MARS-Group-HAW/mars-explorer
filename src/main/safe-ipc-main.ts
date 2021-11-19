import {
  Channel,
  ChannelInputMap,
  ChannelOutputMap,
} from "@shared/types/Channel";
import { ipcMain, IpcMainEvent, IpcMainInvokeEvent } from "electron";
import main from "./main";

class SafeIpcMain {
  static handle<Ch extends Channel>(
    channel: Ch,
    listener: (
      event: IpcMainInvokeEvent,
      args: ChannelInputMap[Ch]
    ) => ChannelOutputMap[Ch] | Promise<ChannelOutputMap[Ch]>
  ): void {
    return ipcMain.handle(channel, listener);
  }

  static on<Ch extends Channel>(
    channel: Ch,
    listener: (event: IpcMainEvent, args: ChannelInputMap[Ch]) => void
  ): Electron.IpcMain {
    return ipcMain.on(channel, listener);
  }

  static once<Ch extends Channel>(
    channel: Ch,
    listener: (event: IpcMainEvent, args: ChannelInputMap[Ch]) => void
  ): Electron.IpcMain {
    return ipcMain.once(channel, listener);
  }

  static send<Ch extends Channel>(channel: Ch, args?: ChannelOutputMap[Ch]) {
    return main.window.webContents.send(channel, args);
  }

  static removeHandler<Ch extends Channel>(channel: Ch) {
    return ipcMain.removeHandler(channel);
  }
}

export default SafeIpcMain;

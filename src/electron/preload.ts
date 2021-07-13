import {Channel} from "../shared/types/Channel";
import {IpcRendererEvent} from "electron";

const {contextBridge, ipcRenderer} = require('electron');

type Methods = 'invoke' | 'send' | 'on';

function callIpcRenderer(method: Methods, channel: Channel, ...args: any[]) {
    if (typeof channel !== 'string') {
        throw 'Error: IPC channel name not allowed';
    }
    if (method === 'invoke' || method === 'send') {
        return ipcRenderer[method](channel, ...args);
    }
    if ('on' === method) {
        const listener = args[0];
        if (!listener) throw 'Listener must be provided';

        // Wrap the given listener in a new function to avoid exposing
        // the `event` arg to our renderer.
        const wrappedListener = (_event: IpcRendererEvent, ...a: any[]) => listener(...a);
        ipcRenderer.on(channel, wrappedListener);

        // The returned function must not return anything (and NOT
        // return the value from `removeListener()`) to avoid exposing ipcRenderer.
        return () => {
            ipcRenderer.removeListener(channel, wrappedListener);
        };
    }
}
contextBridge.exposeInMainWorld(
    'api', {
        invoke: (channel: Channel, ...args: any[]) => callIpcRenderer('invoke', channel, ...args),
        send: (channel: Channel, ...args: any[]) => callIpcRenderer('send', channel, ...args),
        on: (channel: Channel, ...args: any[]) => callIpcRenderer('on', channel, ...args),
    },
);

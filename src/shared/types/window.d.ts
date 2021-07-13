// eslint-disable-next-line import/no-unresolved
import {SafeIpcRenderer} from "SafeIpcRenderer";

export {}

declare global {
    interface Window {
        api: SafeIpcRenderer,
    }
}

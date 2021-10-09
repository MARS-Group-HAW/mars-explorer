// custom implementations of the MessageReader and MessageWriter to plug into a MessageConnection
import { DataCallback, Message, MessageReader } from "vscode-jsonrpc";
import { Disposable } from "monaco-languageclient";
import dummyDisposable from "./DummyDisposable";

// TODO: dispose
export default class RendererIpcMessageReader implements MessageReader {
  private subscribers: DataCallback[] = [];

  private unsubscribeFn: () => void;

  constructor(private channel: string) {
    // listen to incoming language server notifications and messages from the backend
    this.unsubscribeFn = window.api.on(this.channel, (msg: unknown) =>
      this.notifySubscribers(msg as Message)
    );
  }

  // events are not implemented for this example
  public onError = () => dummyDisposable();

  public onClose = () => dummyDisposable();

  public onPartialMessage = () => dummyDisposable();

  public listen(callback: DataCallback): Disposable {
    this.subscribers.push(callback);
    return dummyDisposable();
  }

  public dispose(): void {
    this.unsubscribeFn();
  }

  private notifySubscribers = (msg: Message) => {
    this.subscribers.forEach((s) => s(msg));
  };
}

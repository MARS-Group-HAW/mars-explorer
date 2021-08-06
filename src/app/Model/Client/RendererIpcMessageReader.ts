// custom implementations of the MessageReader and MessageWriter to plug into a MessageConnection
import { DataCallback, Message, MessageReader } from "vscode-jsonrpc";
import { Disposable } from "monaco-languageclient";
import dummyDisposable from "./DummyDisposable";

export default class RendererIpcMessageReader implements MessageReader {
  private subscribers: DataCallback[] = [];

  constructor(private channel: string) {
    // listen to incoming language server notifications and messages from the backend
    window.api.on<Message>(this.channel, (msg) => {
      this.notifySubscribers(msg);
    });
  }

  // events are not implemented for this example
  public onError = () => dummyDisposable();

  public onClose = () => dummyDisposable();

  public onPartialMessage = () => dummyDisposable();

  public listen(callback: DataCallback): Disposable {
    this.subscribers.push(callback);
    return dummyDisposable();
  }

  // eslint-disable-next-line class-methods-use-this
  public dispose(): void {}

  private notifySubscribers = (msg: Message) => {
    this.subscribers.forEach((s) => s(msg));
  };
}

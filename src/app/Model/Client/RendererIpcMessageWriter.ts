// eslint-disable-next-line import/no-extraneous-dependencies
import { Message, MessageWriter } from "vscode-jsonrpc";
import dummyDisposable from "./DummyDisposable";

export default class RendererIpcMessageWriter implements MessageWriter {
  constructor(private channel: string) {}

  // events are not implemented for this example
  public onError = () => dummyDisposable();

  public onClose = () => dummyDisposable();

  public write(msg: Message): Promise<void> {
    // send all requests for the language server to the backend
    return Promise.resolve(window.api.send(this.channel, msg));
  }

  // eslint-disable-next-line class-methods-use-this
  public dispose(): void {
    // nothing to dispose
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function,class-methods-use-this
  end(): void {}
}

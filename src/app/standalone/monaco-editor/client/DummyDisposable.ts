import { Disposable } from "@codingame/monaco-languageclient";

function dummyDisposable(): Disposable {
  return {
    dispose: () => 0,
  };
}

export default dummyDisposable;

import { Disposable } from "monaco-languageclient";

function dummyDisposable(): Disposable {
  return {
    dispose: () => 0,
  };
}

export default dummyDisposable;

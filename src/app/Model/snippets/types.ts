import * as monaco from "monaco-editor";
import { ProviderResult } from "monaco-languageclient";

export interface Snippet {
  provide: (
    model: monaco.editor.ITextModel,
    position: monaco.Position,
    context: monaco.languages.CompletionContext,
    token: monaco.CancellationToken
  ) => ProviderResult<any>;
}

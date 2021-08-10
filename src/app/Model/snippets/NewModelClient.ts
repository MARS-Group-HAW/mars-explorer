import {
  CompletionItemProvider,
  CompletionParams,
} from "monaco-languageclient";
import monaco from "../monaco";

const SpawnCompletion: CompletionItemProvider = {
  provideCompletionItems(params: CompletionParams) {
    const { position } = params;

    const range = {
      startLineNumber: position.line,
      startColumn: position.character,
      endLineNumber: position.line,
      endColumn: position.character,
    };
    return [
      {
        label: '"spawn"',
        kind: monaco.languages.CompletionItemKind.Function,
        documentation:
          "The spawn method of an entity in the MARS-Life framework.",
        insertText: "public void Spawn()\n{\n\t// insert logic\n}",
        range,
      },
    ];
  },
};

export default SpawnCompletion;

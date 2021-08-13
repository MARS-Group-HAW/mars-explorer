import monaco from "../monaco";
import registerSnippet from "./register-snippet";

function createDependencyProposals(range: any) {
  // returning a static list of proposals, not even looking at the prefix (filtering is done by the Monaco editor),
  // here you could do a server side lookup
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
}

export default registerSnippet({
  provideCompletionItems(model, position, context, token) {
    const word = model.getWordUntilPosition(position);
    console.info(model, position, context, token);
    const range = {
      startLineNumber: position.lineNumber,
      startColumn: word.startColumn,
      endLineNumber: position.lineNumber,
      endColumn: word.endColumn,
    };
    return {
      suggestions: createDependencyProposals(range),
    };
  },
});

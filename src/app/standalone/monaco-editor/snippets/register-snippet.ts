import monaco from "../monaco";
import { CSHARP } from "../types";

export default (provider: monaco.languages.CompletionItemProvider) =>
  monaco.languages.registerCompletionItemProvider(CSHARP.id, provider);

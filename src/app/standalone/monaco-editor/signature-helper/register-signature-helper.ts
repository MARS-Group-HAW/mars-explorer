import monaco from "../monaco";
import { CSHARP } from "../types";

export default (provider: monaco.languages.SignatureHelpProvider) =>
  monaco.languages.registerSignatureHelpProvider(CSHARP.id, provider);

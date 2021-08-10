import { MonacoServices } from "monaco-languageclient";
import register from "./NewModelClient";

export default function registerAll(service: MonacoServices) {
  service.languages.registerCompletionItemProvider(["csharp"], {
    ...register,
  });
}

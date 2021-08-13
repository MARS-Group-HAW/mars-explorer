import { languages } from "monaco-editor";
import ILanguageExtensionPoint = languages.ILanguageExtensionPoint;

enum Language {
  CSHARP = "csharp",
}

const CSHARP: ILanguageExtensionPoint = {
  id: Language.CSHARP,
  extensions: [".cs"],
  aliases: ["C#", "csharp"],
};

export default CSHARP;

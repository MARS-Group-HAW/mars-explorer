import { languages } from "monaco-editor";
import ILanguageExtensionPoint = languages.ILanguageExtensionPoint;

enum Language {
  CSHARP = "csharp",
  MARKDOWN = "markdown",
}

const CSHARP: ILanguageExtensionPoint = {
  id: Language.CSHARP,
  extensions: [".cs"],
  aliases: ["C#", "csharp"],
};

const MARKDOWN: ILanguageExtensionPoint = {
  id: Language.MARKDOWN,
  extensions: [".md"],
};

export { CSHARP, MARKDOWN };

import { SpawnOptions } from "child_process";
import { DocumentSelector } from "@codingame/monaco-languageclient";

export type Server = {
  args: string[];
  command: string;
  options: SpawnOptions;
  language: string;
  documentSelector: DocumentSelector;
};

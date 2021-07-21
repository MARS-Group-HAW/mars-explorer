import { SpawnOptions } from "child_process";
import { DocumentSelector } from "monaco-languageclient";

export enum SERVER_NAMES {
  OMNISHARP_TEMP_1349 = "OMNISHARP_TEMP_1349",
  OMNISHARP_TEMP_13712 = "OMNISHARP_TEMP_13712",
}

export type Server = {
  args: string[];
  command: string;
  options: SpawnOptions;
  // workingDirectory: string;
  language: string;
  documentSelector: DocumentSelector;
};

export type ServerMap = { [key in keyof typeof SERVER_NAMES]: Server };

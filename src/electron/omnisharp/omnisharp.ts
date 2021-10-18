export enum OmnisharpNotification {
  PROJECT_ADDED = "o#/projectadded",
  PROJECT_CHANGED = "o#/projectchanged",
  PROJECT_CONFIGURATION = "o#/projectconfiguration",
  PROJECT_DIAGNOSTIC_STATUS = "o#/projectdiagnosticstatus",
  MS_BUILD_PROJECT_DIAGNOSTICS = "o#/msbuildprojectdiagnostics",
  ERROR = "o#/error",
}

export type OmnisharpErrorNotificationParams = {
  Text: string;
  FileName: string;
  Line: number;
  Column: number;
};

export enum OmnisharpErrorMessage {
  DOTNET_NOT_FOUND = "Microsoft.Build.Exceptions.InvalidProjectFileException: The SDK 'Microsoft.NET.Sdk' specified could not be found.",
}

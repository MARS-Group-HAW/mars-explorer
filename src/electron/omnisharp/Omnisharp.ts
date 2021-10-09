export enum OmnisharpNotification {
  PROJECT_ADDED = "o#/projectadded",
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

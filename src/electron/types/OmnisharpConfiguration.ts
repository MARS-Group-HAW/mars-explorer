export type OmnisharpConfiguration = {
  dotnet: {
    enabled: boolean;
    enablePackageRestore: boolean;
  };
  RoslynExtensionsOptions: {
    enableAnalyzersSupport: boolean;
  };
  script: {
    enabled: boolean;
  };
  cake: {
    enabled: boolean;
  };
  fileOptions: {
    excludeSearchPatterns: string[];
  };
  msbuild: {
    enabled: boolean;
    EnablePackageAutoRestore: boolean;
  };
};

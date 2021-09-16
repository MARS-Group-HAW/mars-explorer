import useConfigPath from "./use-config-path";
import useConfigSetup from "./use-config-setup";

function useConfigBootstrap() {
  useConfigPath();
  useConfigSetup();
}

export default useConfigBootstrap;

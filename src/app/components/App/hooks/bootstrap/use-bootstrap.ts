import useConfigBootstrap from "./config";
import useModelBootstrap from "./model";
import useAppInit from "./app";

type State = void;

function useBootstrap(): State {
  useAppInit();
  useModelBootstrap();
  useConfigBootstrap();
}

export default useBootstrap;

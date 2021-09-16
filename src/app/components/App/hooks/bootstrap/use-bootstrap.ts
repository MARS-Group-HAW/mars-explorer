import useConfigBootstrap from "./config";
import useModelBootstrap from "./model";

type State = void;

function useBootstrap(): State {
  useModelBootstrap();
  useConfigBootstrap();
}

export default useBootstrap;

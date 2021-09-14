import { Channel } from "@shared/types/Channel";
import { useAsync } from "react-use";

type State = {
  isLoading: boolean;
  error?: Error;
};

function useMarsFramework(path?: string): State {
  const { loading, error } = useAsync(async () => {
    if (!path) return;

    try {
      await window.api.invoke<string, void>(Channel.INSTALL_MARS, path);
    } catch (e) {
      window.api.logger.error(e);
      throw e;
    }
  }, [path]);

  return {
    isLoading: loading,
    error,
  };
}

export default useMarsFramework;

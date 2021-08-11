import { useEffect, useState } from "react";
import { Channel } from "@shared/types/Channel";

type State = {
  isPageLoading: boolean;
  setPageLoading: (isLoading: boolean) => void;
  onPageChange: () => void;
};

function useApp(): State {
  const [isPageLoading, setPageLoading] = useState(false);

  const onDotnetNotFound = () => {
    window.api.logger.warn(".NET SDK not found.");
    // eslint-disable-next-line no-alert
    alert(
      `Installation of the .NET SDK was not found in your Path. Make sure to have it installed and available in your path. If you've just installed it, try restarting your machine.`
    );
  };

  useEffect(() => {
    window.api.logger.info("App mounted.");
    window.api.on(Channel.DOTNET_NOT_FOUND, onDotnetNotFound);
  }, []);

  return {
    isPageLoading,
    setPageLoading,
    onPageChange: () => setPageLoading(true),
  };
}

export default useApp;

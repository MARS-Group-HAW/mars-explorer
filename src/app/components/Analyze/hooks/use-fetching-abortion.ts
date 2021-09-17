import { Channel } from "@shared/types/Channel";
import { useState } from "react";

type State = {
  isAborting: boolean;
  abortResultFetching: () => void;
  handleAbortionCompleted: () => void;
};

function useFetchingAbortion(): State {
  const [isAborting, setAborting] = useState(false);

  const abortResultFetching = () => {
    setAborting(true);
    window.api.send(Channel.ANALYSIS_ABORT_GET_LAST_RESULT);
  };

  const handleAbortionCompleted = () => setAborting(false);

  return {
    isAborting,
    abortResultFetching,
    handleAbortionCompleted,
  };
}

export default useFetchingAbortion;

import { IFileRef } from "@shared/types/File";
import { Channel } from "@shared/types/Channel";
import {
  ParseAbortRequest,
  ParseCompleteNotification,
  ParseResultMessage,
} from "@shared/types/ParseCompleteNotification";
import { useMap, useUnmount } from "react-use";
import { useRef } from "react";
import ResultData from "../utils/ResultData";
import useChannelSubscription from "../../../utils/hooks/use-channel-subscription";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks/use-store";
import { selectSimulationRunningStatus } from "../../QuickStartBar/utils/simulation-slice";
import {
  addData as addDataToStore,
  resetData,
  selectLoadingFiles,
  setDataLoadingCompleted,
} from "../utils/analyze-slice";

type DisposableFn = () => void;
type DisposableFnMap = { [key: string]: DisposableFn };

type State = {
  fetchData: (file: IFileRef) => void;
  abortFetching: (fileName: string) => void;
};

function useResultDataPerObject(): State {
  const dispatch = useAppDispatch();
  const isSimulationRunning = useAppSelector(selectSimulationRunningStatus);
  const loadingFiles = useAppSelector(selectLoadingFiles);

  const [, { set, get }] = useMap<DisposableFnMap>({});

  const getReference = useRef<(name: string) => DisposableFn>();
  getReference.current = get;

  const handleResultMessage = ({ name, data }: ParseResultMessage) =>
    dispatch(
      addDataToStore({
        name,
        data: data as ResultData,
      })
    );

  const fetchData = (file: IFileRef) => {
    const { name, path } = file;

    if (!isSimulationRunning) {
      dispatch(resetData({ name }));
      window.api.send(Channel.ANALYSIS_GET_LAST_RESULT, path);
    }

    // FIXME window.api.send(Channel.ANALYSIS_WATCH_RESULT, path);
    const disposeFn = window.api.on<ParseResultMessage>(
      Channel.ANALYSIS_SEND_CSV_ROW,
      handleResultMessage
    );
    set(file.name, () => disposeFn());
  };

  const abortFetching = (name: string) => {
    window.api.logger.info("Sending abort request for ", name);
    window.api.send<ParseAbortRequest>(Channel.ANALYSIS_ABORT_GET_LAST_RESULT, {
      name,
    });
  };

  const handleCompletion = ({ name, aborted }: ParseCompleteNotification) => {
    window.api.logger.info(
      `Fetching of ${name} completed (aborted: ${aborted}).`
    );

    if (aborted) {
      dispatch(resetData({ name }));
    } else {
      dispatch(setDataLoadingCompleted({ name }));
    }

    const disposeFn = getReference.current(name);

    if (disposeFn) {
      disposeFn();
    } else {
      window.api.logger.warn(`No dispose function for ${name} found.`);
    }
  };

  useChannelSubscription(Channel.ANALYSIS_RESULT_END, handleCompletion);

  useUnmount(() => loadingFiles.forEach(abortFetching));

  return {
    fetchData,
    abortFetching,
  };
}

export default useResultDataPerObject;

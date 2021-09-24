import { IFileRef } from "@shared/types/File";
import { Channel } from "@shared/types/Channel";
import { ParseCompleteNotification } from "@shared/types/ParseCompleteNotification";
import { useMap, useUnmount } from "react-use";
import { useRef } from "react";
import ResultData from "../utils/ResultData";
import useChannelSubscription from "../../../utils/hooks/use-channel-subscription";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks/use-store";
import { selectSimulationRunningStatus } from "../../QuickStartBar/utils/simulation-slice";
import {
  addData as addDataToStore,
  resetData,
  selectAnalyzeAnyFileFetching,
  setDataLoadingCompleted,
} from "../utils/analyze-slice";

type State = {
  fetchData: (file: IFileRef) => void;
  abortFetching: (file: IFileRef) => void;
};

function useResultDataPerObject(): State {
  const isSimulationRunning = useAppSelector(selectSimulationRunningStatus);
  const isAnyFileFetching = useAppSelector(selectAnalyzeAnyFileFetching);
  const dispatch = useAppDispatch();

  const [, { set, get }] = useMap<{
    [key: string]: () => void;
  }>({});

  const getReference = useRef<(name: string) => () => void>();
  getReference.current = get;

  const fetchData = (file: IFileRef) => {
    const { name, path } = file;

    if (!isSimulationRunning) {
      dispatch(resetData({ name }));
      window.api.send(Channel.ANALYSIS_GET_LAST_RESULT, path);
    }

    // FIXME window.api.send(Channel.ANALYSIS_WATCH_RESULT, path);
    const disposeFn = window.api.on<unknown[]>(
      Channel.ANALYSIS_SEND_CSV_ROW,
      (rawData) => {
        window.api.logger.debug("receiving ...");
        dispatch(
          addDataToStore({
            name,
            data: rawData as ResultData,
          })
        );
      }
    );
    set(file.name, () => disposeFn());
  };

  const abortFetching = (file: IFileRef) => {
    window.api.logger.info("Sending abort request for ", file.name);
    window.api.send(Channel.ANALYSIS_ABORT_GET_LAST_RESULT);
  };

  const onFetchCompletion = (file: IFileRef, aborted: boolean) => {
    window.api.logger.info(
      `Fetching of ${file.name} completed (aborted: ${aborted}).`
    );
    dispatch(setDataLoadingCompleted({ name: file.name }));

    const disposeFn = getReference.current(file.name);

    if (disposeFn) {
      disposeFn();
    } else {
      window.api.logger.warn(`No dispose function for ${file.name} found.`);
    }
  };

  useChannelSubscription(
    Channel.ANALYSIS_RESULT_END,
    ({ name, path, aborted }: ParseCompleteNotification) =>
      onFetchCompletion({ path, name }, aborted)
  );

  useUnmount(
    () =>
      isAnyFileFetching &&
      window.api.send(Channel.ANALYSIS_ABORT_GET_LAST_RESULT)
  );

  return {
    fetchData,
    abortFetching,
  };
}

export default useResultDataPerObject;

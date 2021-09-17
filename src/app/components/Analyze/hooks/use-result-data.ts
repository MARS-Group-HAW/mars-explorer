import { useState } from "react";
import { Channel } from "@shared/types/Channel";
import { useBoolean } from "react-use";
import ResultData from "../utils/ResultData";

type State = {
  isFetching: boolean;
  data: ResultData;
  handleData: (data: unknown[]) => void;
  resetData: () => void;
  handleFetchingCompleted: () => void;
  fetchLastData: (path: string) => void;
  fetchLiveData: (path: string) => void;
};

function useResultData(): State {
  const [isFetching, setFetching] = useBoolean(false);
  const [data, setData] = useState<ResultData>([]);

  const handleData = (resultData: unknown[]) => {
    setData((oldArray) => [...oldArray, ...(resultData as ResultData)]);
  };

  const resetData = () => setData([]);

  const handleFetchingCompleted = () => {
    setFetching(false);
  };

  const prepareFetch = () => {
    resetData();
    setFetching(true);
  };

  const fetchLastData = (path: string) => {
    prepareFetch();
    window.api.send(Channel.ANALYSIS_GET_LAST_RESULT, path);
  };
  const fetchLiveData = (path: string) => {
    prepareFetch();
    window.api.send(Channel.ANALYSIS_WATCH_RESULT, path);
  };

  return {
    data,
    isFetching,
    fetchLastData,
    fetchLiveData,
    handleData,
    resetData,
    handleFetchingCompleted,
  };
}

export default useResultData;

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks/use-store";
import { selectProject } from "../../Home/utils/project-slice";
import {
  restoreDataFromLocalStorage,
  saveDataToLocalStorage,
  selectSimulationFinishedStatus,
} from "../utils/simulation-slice";

type State = void;

function useResultsInLocalStorage(): State {
  const { path } = useAppSelector(selectProject);
  const simEndedWithSuccess = useAppSelector(selectSimulationFinishedStatus);
  const dispatch = useAppDispatch();

  const dispatchSaveResults = () => {
    if (!path || !simEndedWithSuccess) return;

    try {
      dispatch(saveDataToLocalStorage(path));
    } catch (e: unknown) {
      if (e === "QUOTA_EXCEEDED_ERR") {
        alert(
          "The result could no be saved because it was too large. The results will not be available after a restart."
        ); // data wasn't successfully saved due to quota exceed so throw an error
      }
    }
  };

  const dispatchRestoreResults = (projectPath?: string) =>
    path && dispatch(restoreDataFromLocalStorage(projectPath));

  useEffect(() => {
    dispatchRestoreResults(path);
  }, [path]);
  useEffect(dispatchSaveResults, [simEndedWithSuccess]);
}

export default useResultsInLocalStorage;

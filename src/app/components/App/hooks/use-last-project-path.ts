import { useAsync } from "react-use";
import { ModelRef } from "@shared/types/Model";
import { Channel } from "@shared/types/Channel";
import LocalStorageService, {
  CacheKey,
} from "../../../utils/local-storage-service";
import { useAppDispatch } from "../../../utils/hooks/use-store";
import { setProject } from "../../Home/utils/project-slice";

function useLastProjectPath() {
  const dispatch = useAppDispatch();

  useAsync(async () => {
    const lastProjectPath = LocalStorageService.getItem(CacheKey.LAST_PATH);

    if (!lastProjectPath) return;

    const projectRef = await window.api.invoke<string, ModelRef | null>(
      Channel.CHECK_LAST_PATH,
      lastProjectPath
    );

    if (!projectRef) return;

    window.api.logger.info("Using last project: ", projectRef.name);
    dispatch(setProject(projectRef));
  }, []);
}

export default useLastProjectPath;

import { useMount } from "react-use";
import {
  selectObjectAtIndex,
  setObjectNamespace,
  useSharedMappings,
} from "./use-shared-mappings";
import FieldNames from "../utils/fieldNames";

type State = {
  namespace: string;
};

function useMappingsTab(
  type: FieldNames.AGENTS | FieldNames.LAYERS | FieldNames.ENTITIES
): State {
  const [state, dispatch] = useSharedMappings();
  const namespace = selectObjectAtIndex(state);

  useMount(() => dispatch(setObjectNamespace({ namespace: type })));

  return {
    namespace,
  };
}

export default useMappingsTab;

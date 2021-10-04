import { useField } from "formik";
import ObjectMappings from "../mappings-form/utils/types";
import {
  selectObjectAtIndex,
  useSharedMappings,
} from "../../hooks/use-shared-mappings";

type State = {
  selectedAgentNamespace: string;
};

function useAgentsForm(): State {
  const [state] = useSharedMappings();
  const namespace = selectObjectAtIndex(state);
  const [{ value }] = useField<ObjectMappings>(namespace);

  return {
    selectedAgentNamespace: namespace,
  };
}

export default useAgentsForm;

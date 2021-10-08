import FieldNames from "../../utils/fieldNames";
import useMappingsTab from "../../hooks/use-mappings-tab";

type State = {
  namespace: string;
};

function useAgentsForm(): State {
  const { namespace } = useMappingsTab(FieldNames.AGENTS);

  return {
    namespace,
  };
}

export default useAgentsForm;

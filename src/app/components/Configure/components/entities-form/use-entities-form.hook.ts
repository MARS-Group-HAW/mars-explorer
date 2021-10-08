import FieldNames from "../../utils/fieldNames";
import useMappingsTab from "../../hooks/use-mappings-tab";

type State = {
  namespace: string;
};

function useEntitiesForm(): State {
  const { namespace } = useMappingsTab(FieldNames.ENTITIES);

  return {
    namespace,
  };
}

export default useEntitiesForm;

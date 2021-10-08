import useMappingsTab from "../../hooks/use-mappings-tab";
import FieldNames from "../../utils/fieldNames";

type State = {
  namespace: string;
};

function useLayersForm(): State {
  const { namespace } = useMappingsTab(FieldNames.LAYERS);

  return {
    namespace,
  };
}

export default useLayersForm;

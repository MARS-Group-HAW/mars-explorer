import { useField } from "formik";
import ObjectMappings from "../mappings-form/utils/types";

type State = {
  agents: string[];
};

function useObjectsForm(namespaceAgents: string): State {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [{ value }] = useField<ObjectMappings>(namespaceAgents);

  return { agents: [] };
}

export default useObjectsForm;

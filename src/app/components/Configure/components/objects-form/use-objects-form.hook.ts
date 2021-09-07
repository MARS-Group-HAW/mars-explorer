import { useField } from "formik";
import ObjectMappings from "../mappings-form/utils/types";

type State = {
  agents: string[];
};

function useObjectsForm(namespaceAgents: string): State {
  console.log(namespaceAgents);
  const [{ value }] = useField<ObjectMappings>(namespaceAgents);
  console.log(value);

  return { agents: [] };
}

export default useObjectsForm;

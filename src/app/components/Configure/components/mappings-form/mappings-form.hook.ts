import { useField } from "formik";
import { ObjectMapping } from "./utils/types";

type State = {};

function useMappingsForm(namespace: string): State {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [{ value }] = useField<ObjectMapping>(namespace);

  return {};
}

export default useMappingsForm;

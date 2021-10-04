import { useField } from "formik";
import ObjectMappings from "../mappings-form/utils/types";
import {
  setMappingNamespace,
  useSharedMappings,
} from "../../hooks/use-shared-mappings";

type State = {
  objectNames: string[];
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
};

function useObjectList(): State {
  const [{ objectNsp, mappingIndex }, dispatch] = useSharedMappings();

  const [{ value }] = useField<ObjectMappings>(objectNsp);

  const setSelectedIndex = (index: number) =>
    dispatch(setMappingNamespace(index));

  return {
    objectNames: value.map((mapping) => mapping.name),
    selectedIndex: mappingIndex,
    setSelectedIndex,
  };
}

export default useObjectList;

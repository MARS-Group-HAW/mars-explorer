import { useField } from "formik";
import { useLatest } from "react-use";
import ObjectMappings from "../mappings-form/utils/types";
import {
  setMappingNamespace,
  useSharedMappings,
} from "../../hooks/use-shared-mappings";
import defaultValues from "../agents-form/utils/defaultValues";

type State = {
  objectNames: string[];
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  onAddClick: () => void;
};

function useObjectList(): State {
  const [{ objectNsp, mappingIndex }, dispatch] = useSharedMappings();

  const [{ value }, , { setValue }] = useField<ObjectMappings>(objectNsp);
  const latestValue = useLatest(value);

  const setSelectedIndex = (index: number) =>
    dispatch(setMappingNamespace(index));

  const onAddClick = () => setValue([...latestValue.current, defaultValues]);

  return {
    objectNames: value.map((mapping) => mapping.name),
    selectedIndex: mappingIndex,
    setSelectedIndex,
    onAddClick,
  };
}

export default useObjectList;

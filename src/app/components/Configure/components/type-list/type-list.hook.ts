import { useField } from "formik";
import { useLatest } from "react-use";
import SimObjects from "@shared/types/sim-objects";
import ObjectMappings from "../mappings-form/utils/types";
import {
  setMappingNamespace,
  useSharedMappings,
} from "../../hooks/use-shared-mappings";
import defaultValues from "../agents-form/utils/defaultValues";
import FieldNames from "../../utils/fieldNames";

type State = {
  type: Omit<FieldNames, "GLOBALS">;
  typeNames: string[];
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  onAddClick: () => void;
};

function useTypeList(): State {
  const [{ objectNsp, mappingIndex }, dispatch] = useSharedMappings();

  const [{ value }, , { setValue }] = useField<ObjectMappings>(objectNsp);

  const setSelectedIndex = (index: number) =>
    dispatch(setMappingNamespace(index));

  const latestValue = useLatest(value);
  const onAddClick = () => setValue([...latestValue.current, defaultValues]);

  return {
    type: objectNsp,
    typeNames: value ? value.map((mapping) => mapping.name) : [],
    selectedIndex: mappingIndex,
    setSelectedIndex,
    onAddClick,
  };
}

export default useTypeList;

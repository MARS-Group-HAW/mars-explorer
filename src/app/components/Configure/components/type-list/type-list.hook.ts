import { useField } from "formik";
import { useLatest } from "react-use";
import TypeMapping from "../mappings-form/utils/types";
import {
  resetMappingNamespace,
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
  onDeleteClick: (index: number) => void;
};

function useTypeList(): State {
  const [{ objectNsp, mappingIndex }, dispatch] = useSharedMappings();

  const [{ value }, , { setValue, setTouched }] =
    useField<TypeMapping[]>(objectNsp);

  const setSelectedIndex = (index: number) =>
    dispatch(setMappingNamespace(index));

  const latestValue = useLatest(value);
  const onAddClick = () => setValue([...latestValue.current, defaultValues]);
  const onDeleteClick = (indexToDelete: number) => {
    if (mappingIndex === indexToDelete) {
      dispatch(resetMappingNamespace());
    }

    setValue(
      latestValue.current.filter((val, index) => index !== indexToDelete)
    );
    setTouched(true);
  };

  return {
    type: objectNsp,
    typeNames: value ? value.map((mapping) => mapping.name) : [],
    selectedIndex: mappingIndex,
    setSelectedIndex,
    onAddClick,
    onDeleteClick,
  };
}

export default useTypeList;

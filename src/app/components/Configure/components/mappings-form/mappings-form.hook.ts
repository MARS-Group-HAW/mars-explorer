import { useField } from "formik";
import { useLatest } from "react-use";
import { IndividualMapping } from "./utils/types";
import {
  selectObjectAtIndex,
  useSharedMappings,
} from "../../hooks/use-shared-mappings";
import FieldNames from "./utils/fieldNames";
import withNamespace from "../../utils/withNamespace";
import defaultValues from "./utils/defaultValues";

type State = {
  showForm: boolean;
  individualMappingNamespaces: string[];
  onAddMappingClick: () => void;
  onDeleteMappingClick: (index: number) => void;
};

function useMappingsForm(): State {
  const [state] = useSharedMappings();
  const { mappingIndex } = state;
  const namespace = selectObjectAtIndex(state);
  const [{ value: mappingValues }, , { setValue, setTouched }] = useField<
    IndividualMapping[]
  >(withNamespace(FieldNames.MAPPING, namespace));
  const latestValue = useLatest(mappingValues);

  const mappingNamespaces = mappingValues
    ? mappingValues.map(
        (_, index) => `${namespace}.${FieldNames.MAPPING}[${index}]`
      )
    : [];

  const onAddMappingClick = () => {
    if (!latestValue.current) {
      setValue([defaultValues]);
    } else {
      setValue([...latestValue.current, defaultValues]);
    }
    setTouched(true);
  };

  const onDeleteMappingClick = (indexToDelete: number) => {
    setValue(latestValue.current.filter((_, index) => indexToDelete !== index));
    setTouched(true);
  };

  return {
    showForm: Number.isInteger(mappingIndex),
    individualMappingNamespaces: mappingNamespaces,
    onAddMappingClick,
    onDeleteMappingClick,
  };
}

export default useMappingsForm;

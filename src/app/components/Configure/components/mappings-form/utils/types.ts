import FieldNames from "./fieldNames";

type ObjectMappings = ObjectMapping[];

type ObjectMapping = {
  [FieldNames.NAME]: string;
  [FieldNames.COUNT]: number;
  [FieldNames.FILE]: string;
  [FieldNames.MAPPING]: IndividualMapping[];
};

type IndividualMapping = {
  [FieldNames.PARAMETER]: string;
  [FieldNames.VALUE]: number;
};

export default ObjectMappings;

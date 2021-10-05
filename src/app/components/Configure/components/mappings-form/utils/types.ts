import FieldNames from "./fieldNames";

type ObjectMappings = ObjectMapping[];

export type ObjectMapping = {
  [FieldNames.NAME]: string;
  [FieldNames.COUNT]: number;
  [FieldNames.MAPPING]: IndividualMapping[];
};

export type IndividualMapping = {
  [FieldNames.PARAMETER]: string;
  [FieldNames.VALUE]: number;
};

export default ObjectMappings;

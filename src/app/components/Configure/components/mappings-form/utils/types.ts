import FieldNames from "./fieldNames";

type TypeMapping = ObjectMapping;

export type ObjectMapping = {
  [FieldNames.NAME]: string;
  [FieldNames.MAPPING]: IndividualMapping[];
};

export type AgentMapping = ObjectMapping & {
  [FieldNames.COUNT]: number;
};

export type EntitiesMapping = AgentMapping;

export type LayersMapping = ObjectMapping & {
  [FieldNames.FILE]?: string;
};

export type IndividualMapping = {
  [FieldNames.PARAMETER]: string;
  [FieldNames.VALUE]: number;
};

export default TypeMapping;

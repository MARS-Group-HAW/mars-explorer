import { AgentMapping, EntitiesMapping } from "../../mappings-form/utils/types";

const defaultValues: Omit<AgentMapping | EntitiesMapping, "name"> = {
  count: 1,
  mapping: [],
};

export default defaultValues;

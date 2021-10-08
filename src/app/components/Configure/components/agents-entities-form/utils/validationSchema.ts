import { SchemaOf } from "yup";
import Yup from "../../../utils/yup-extended";

import FieldNames from "../../mappings-form/utils/fieldNames";
import IndividualMappingsSchema from "../../mappings-form/utils/validationSchema";
import AgentMappings from "../../agents-form/utils/types";
import EntitiesMappings from "../../entities-form/utils/types";

const ValidationSchema: SchemaOf<AgentMappings | EntitiesMappings> = Yup.array()
  .of(
    Yup.object().shape({
      [FieldNames.NAME]: Yup.string().required(),
      [FieldNames.COUNT]: Yup.number().integer().min(0),
      [FieldNames.FILE]: Yup.string().nullable(),
      [FieldNames.MAPPING]: IndividualMappingsSchema,
    })
  )
  .uniqueProperty(FieldNames.NAME, "Duplicate name");

export default ValidationSchema;

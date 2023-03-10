import { SchemaOf } from "yup";
import Yup from "../../../utils/yup-extended";

import FieldNames from "../../mappings-form/utils/fieldNames";
import IndividualMappingsSchema from "../../mappings-form/utils/validationSchema";
import LayersMappings from "./types";

const ValidationSchema: SchemaOf<LayersMappings> = Yup.array()
  .of(
    Yup.object().shape({
      [FieldNames.NAME]: Yup.string().required(),
      [FieldNames.FILE]: Yup.string().nullable().optional(),
      [FieldNames.MAPPING]: IndividualMappingsSchema,
    })
  )
  .uniqueProperty(FieldNames.NAME, "Duplicate layer name");
export default ValidationSchema;

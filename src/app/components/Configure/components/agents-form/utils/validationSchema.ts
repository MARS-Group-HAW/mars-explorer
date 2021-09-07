import { TypeOf } from "yup";
import MappingValidationSchema from "@app/components/Configure/components/mappings-form/utils/validationSchema";

export type AgentsValidationSchema = TypeOf<typeof MappingValidationSchema>;

export default MappingValidationSchema;

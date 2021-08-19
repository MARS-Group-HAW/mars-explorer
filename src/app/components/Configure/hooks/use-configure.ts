import { FormikValues } from "formik";
import { TypeOf } from "yup";
import validationSchema from "../utils/validationSchema";

interface ConfigSchema extends TypeOf<typeof validationSchema> {}

type State = {
  handleSubmit: (values: FormikValues) => void;
};

function useConfigure(): State {
  const handleSubmit = (values: FormikValues) => {
    const config: ConfigSchema = validationSchema.validateSync(values);
    window.api.logger.info("Submitting", config);
  };

  return {
    handleSubmit,
  };
}

export default useConfigure;

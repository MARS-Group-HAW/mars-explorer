import { useEffect } from "react";
import { FormikValues } from "formik";
import { TypeOf } from "yup";
import validationSchema from "../utils/validationSchema";
import { Loading } from "../../../util/types/Loading";

interface ConfigSchema extends TypeOf<typeof validationSchema> {}

type Props = Loading;

type State = {
  handleSubmit: (values: FormikValues) => void;
};

function useConfigure({ setLoading }: Props): State {
  useEffect(() => {
    setLoading(false);
  }, []);

  const handleSubmit = (values: FormikValues) => {
    const config: ConfigSchema = validationSchema.validateSync(values);
    window.api.logger.info("Submitting", config);
  };

  return {
    handleSubmit,
  };
}

export default useConfigure;

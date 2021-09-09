import { FormikValues } from "formik";
import { TypeOf } from "yup";
import useGetConfig from "@app/components/Configure/hooks/use-get-config";
import { selectProject } from "@app/components/Home/utils/project-slice";
import { useEffect } from "react";
import useSnackbar from "@app/components/Configure/hooks/use-snackbar";
import { useAppSelector } from "../../../utils/hooks/use-store";
import validationSchema from "../utils/validationSchema";

interface ConfigSchema extends TypeOf<typeof validationSchema> {}

type State = {
  config: any;
  showNoPathMsg: boolean;
  showForm: boolean;
  showSpinner: boolean;
  showExistingConfigMsg: boolean;
  showNewConfigMsg: boolean;
  showErrorMsg: boolean;
  error?: Error;
  handleSubmit: (values: FormikValues) => void;
};

function useConfigure(): State {
  const { path } = useAppSelector(selectProject);
  const { config, loading, error, wasCreated } = useGetConfig(path);
  const { showSnackbar } = useSnackbar(loading);

  const configLoadedSuccessfully = !loading && !error && Boolean(config);

  const handleSubmit = (values: FormikValues) => {
    const parsedConfig: ConfigSchema = validationSchema.validateSync(values);
    window.api.logger.info("Submitting", parsedConfig);
  };

  useEffect(
    () =>
      configLoadedSuccessfully &&
      window.api.logger.info("Config loaded successfully", config),
    [configLoadedSuccessfully]
  );

  useEffect(
    () => error && window.api.logger.warn(`${error?.name}: ${error?.message}`),
    [error]
  );

  return {
    showNoPathMsg: !path,
    config,
    showForm: configLoadedSuccessfully,
    showSpinner: loading,
    showExistingConfigMsg:
      showSnackbar && configLoadedSuccessfully && !wasCreated,
    showNewConfigMsg: showSnackbar && configLoadedSuccessfully && wasCreated,
    showErrorMsg: !loading && Boolean(error),
    error,
    handleSubmit,
  };
}

export default useConfigure;

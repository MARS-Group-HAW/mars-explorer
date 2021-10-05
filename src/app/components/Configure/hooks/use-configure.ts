import { FormikValues } from "formik";
import useGetConfig from "@app/components/Configure/hooks/use-get-config";
import { selectProject } from "@app/components/Home/utils/project-slice";
import { useContext, useEffect } from "react";
import { Channel } from "@shared/types/Channel";
import { useLatest } from "react-use";
import { useAppSelector } from "../../../utils/hooks/use-store";
import validationSchema from "../utils/validationSchema";
import { SnackBarContext } from "../../shared/snackbar/snackbar-provider";
import FormTransformer from "../utils/transform";

type State = {
  config: any;
  showNoPathMsg: boolean;
  showForm: boolean;
  showLoading: boolean;
  handleSubmit: (values: FormikValues) => void;
};

function useConfigure(): State {
  const { path } = useAppSelector(selectProject);
  const latestPath = useLatest(path);
  const { config, loading, error, wasCreated } = useGetConfig(path);
  const { addInfoAlert, addSuccessAlert, addErrorAlert } =
    useContext(SnackBarContext);

  const handleSubmit = (values: FormikValues) => {
    window.api.logger.info("Submitting", values);
    validationSchema
      .validate(values)
      .then((parsedConfig: any) => {
        const transformedConfig = FormTransformer.formToConfig(parsedConfig);

        window.api
          .invoke<{ path: string; content: string }, void>(
            Channel.WRITE_CONTENT_TO_FILE,
            {
              path: latestPath.current,
              content: JSON.stringify(transformedConfig, null, "\t"),
            }
          )
          .then(() => addSuccessAlert({ msg: "Your config was saved." }))
          .catch((err) =>
            addErrorAlert({
              msg: `An error occurred while parsing your config: ${err}`,
              timeout: 10000,
            })
          );
      })
      .catch((err) => {
        addErrorAlert({
          msg: `An error occurred while parsing your config: ${err}`,
          timeout: 10000,
        });
      });
  };

  useEffect(() => {
    if (loading) return;

    if (error) {
      addErrorAlert({
        msg: `An error occurred while parsing your config: ${error}`,
      });
      return;
    }

    if (!config) return;

    let msg;

    if (wasCreated) {
      msg = "Config was created.";
    } else {
      msg = "Config was loaded.";
    }

    addInfoAlert({ msg });
  }, [loading, error, config, wasCreated]);

  return {
    showNoPathMsg: !path,
    config,
    showForm: path && !loading && config,
    showLoading: loading,
    handleSubmit,
  };
}

export default useConfigure;

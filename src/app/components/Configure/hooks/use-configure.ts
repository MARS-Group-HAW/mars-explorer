import { FormikValues } from "formik";
import { selectProject } from "@app/components/Home/utils/project-slice";
import { useContext } from "react";
import { Channel } from "@shared/types/Channel";
import { useLatest } from "react-use";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks/use-store";
import validationSchema from "../utils/validationSchema";
import { SnackBarContext } from "../../shared/snackbar/snackbar-provider";
import FormTransformer, { FormSchema } from "../utils/transform";
import {
  selectConfig,
  selectConfigHasBeenChecked,
  selectConfigLoading,
  setConfig,
  setErrorState,
  setValidState,
} from "../utils/config-slice";

type State = {
  config: FormSchema;
  showNoPathMsg: boolean;
  showForm: boolean;
  showLoading: boolean;
  handleSubmit: (values: FormikValues) => void;
};

function useConfigure(): State {
  const dispatch = useAppDispatch();
  const hasBeenChecked = useAppSelector(selectConfigHasBeenChecked);
  const isLoading = useAppSelector(selectConfigLoading);
  const config = useAppSelector(selectConfig);
  const { path } = useAppSelector(selectProject);
  const latestPath = useLatest(path);
  const { addSuccessAlert, addErrorAlert } = useContext(SnackBarContext);

  const handleSubmit = (values: FormikValues) => {
    validationSchema
      .validate(values)
      .then((parsedConfig: any) => {
        const transformedConfig = FormTransformer.formToConfig(parsedConfig);

        window.api
          .invoke<{ path: string; content: string }, void>(
            Channel.WRITE_CONFIG_TO_FILE,
            {
              path: latestPath.current,
              content: JSON.stringify(transformedConfig, null, "\t"),
            }
          )
          .then(() => {
            addSuccessAlert({ msg: "Your config was saved." });
            dispatch(setValidState());
            dispatch(setConfig(values));
          })
          .catch((err) => {
            addErrorAlert({
              msg: `An error occurred while parsing your config: ${err}`,
              timeout: 10000,
            });
            dispatch(setErrorState());
          });
      })
      .catch((err) => {
        addErrorAlert({
          msg: `An error occurred while parsing your config: ${err}`,
          timeout: 10000,
        });
        dispatch(setErrorState());
      });
  };

  return {
    config,
    showNoPathMsg: !path,
    showForm: hasBeenChecked && Boolean(config),
    showLoading: isLoading,
    handleSubmit,
  };
}

export default useConfigure;

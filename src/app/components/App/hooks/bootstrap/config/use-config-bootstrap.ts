import { useAsync } from "react-use";
import { Channel } from "@shared/types/Channel";
import { useContext } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../../utils/hooks/use-store";
import { selectProject } from "../../../../Home/utils/project-slice";
import FormTransformer, {
  FormSchema,
} from "../../../../Configure/utils/transform";
import {
  resetConfig,
  setConfig,
  setErrors,
  setErrorState,
  setInvalidState,
  setLoadingState,
  setUnknownState,
  setValidState,
} from "../../../../Configure/utils/config-slice";
import validationSchema from "../../../../Configure/utils/validationSchema";
import { SnackBarContext } from "../../../../shared/snackbar/snackbar-provider";

function useConfigBootstrap() {
  const { path } = useAppSelector(selectProject);
  const dispatch = useAppDispatch();
  const { addErrorAlert } = useContext(SnackBarContext);

  const checkExistance = (projectRoot: string) =>
    window.api.invoke(Channel.DOES_CONFIG_EXIST, projectRoot);

  const getConfigContents = (projectPath: string) =>
    window.api.invoke(Channel.GET_CONFIG_IN_PROJECT, projectPath);

  const validateConfig = (config: FormSchema) =>
    validationSchema.validate(config);

  useAsync(async () => {
    if (!path) {
      dispatch(setUnknownState());
      return;
    }

    dispatch(resetConfig());
    dispatch(setLoadingState());

    const doesExist = await checkExistance(path);

    if (!doesExist) {
      window.api.logger.info(
        "A config file does not exist. Did you delete it by accident?"
      );
      return;
    }

    const configContents = await getConfigContents(path);

    if (!configContents) {
      addErrorAlert({ msg: "There was an error reading your config.json." });
      dispatch(setErrorState());
      return;
    }

    let parsedConfigContents;

    try {
      parsedConfigContents = FormTransformer.configToForm(
        JSON.parse(configContents)
      );
    } catch (e) {
      addErrorAlert({
        msg: `There was an error reading your config.json: ${e}. Check if your "config.json" is valid. If the error persists, delete the "config.json" file.`,
      });
      dispatch(setErrorState());
      return;
    }

    let isValid;

    try {
      isValid = await validateConfig(parsedConfigContents);
    } catch (e: any) {
      if (e.name === "ValidationError") {
        dispatch(setErrors(e.errors));
      }
    }

    if (!isValid) {
      dispatch(setInvalidState());
    } else {
      dispatch(setValidState());
    }
    dispatch(setConfig(parsedConfigContents));
  }, [path]);
}

export default useConfigBootstrap;

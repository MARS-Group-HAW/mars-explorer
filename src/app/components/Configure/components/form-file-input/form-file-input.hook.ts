import { FieldInputProps, useField } from "formik";
import { ChangeEvent } from "react";
import { Channel } from "@shared/types/Channel";
import { useAppSelector } from "../../../../utils/hooks/use-store";
import { selectProject } from "../../../Home/utils/project-slice";

type State = {
  value: string;
  error?: string;
  handleFileInput: (e: ChangeEvent<HTMLInputElement>) => void;
  handleBlur: FieldInputProps<string>["onBlur"];
  handleClearClick: () => void;
};

function useFormFileInput(namespace: string): State {
  const { path } = useAppSelector(selectProject);
  const [{ value, onBlur }, { error }, { setValue }] =
    useField<string>(namespace);

  const handleFileInput = async (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    if (files.length === 0) return;

    const relativePath = await window.api.invoke(
      Channel.PATH_ABSOLUTE_TO_RELATIVE,
      {
        from: path,
        to: files[0].path,
      }
    );

    setValue(relativePath as string);
  };

  const handleClearClick = () => {
    setValue(null);
  };

  return {
    value,
    error,
    handleFileInput,
    handleBlur: onBlur,
    handleClearClick,
  };
}

export default useFormFileInput;

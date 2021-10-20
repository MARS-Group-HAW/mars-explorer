import * as React from "react";
import { Channel } from "@shared/types/Channel";
import { Prompt, useHistory } from "react-router-dom";
import { useBoolean } from "react-use";
import { useFormikContext } from "formik";
import useFormSaveableState from "../../hooks/use-form-saveable-state";
import { useAppSelector } from "../../../../utils/hooks/use-store";
import { selectConfigIsDirty } from "../../utils/config-slice";

function UnsavedChangesPrompt() {
  const { submitForm } = useFormikContext();
  const router = useHistory();
  const canBeSaved = useFormSaveableState();
  const configIsDirty = useAppSelector(selectConfigIsDirty);

  const [pending, setPending] = useBoolean(false);
  const [confirmed, setConfirmed] = useBoolean(false);

  const showUnsaveableChangesDialog = (navigate: () => void) => {
    window.api.invoke(Channel.SHOW_UNSAVEABLE_CHANGES_DIALOG).then((result) => {
      switch (result) {
        case true: {
          setConfirmed(true);
          navigate();
          break;
        }
        case false:
        default: {
          setConfirmed(false);
          setPending(false);
        }
      }
    });
  };

  const showUnsavedChangesDialog = (navigate: () => void) => {
    window.api.invoke(Channel.SHOW_UNSAVED_CHANGES_DIALOG).then((result) => {
      switch (result) {
        case true: {
          submitForm().then(() => {
            setConfirmed(true);
            navigate();
          });
          break;
        }
        case false: {
          setConfirmed(true);
          navigate();
          break;
        }
        case null:
        default: {
          setConfirmed(false);
          setPending(false);
        }
      }
    });
  };

  return (
    <Prompt
      when={configIsDirty}
      message={(location) => {
        if (!pending && !confirmed) {
          const navigate = () => router.push(location);

          if (canBeSaved) {
            showUnsavedChangesDialog(navigate);
          } else {
            showUnsaveableChangesDialog(navigate);
          }

          setPending(true);
        }
        return confirmed;
      }}
    />
  );
}

export default UnsavedChangesPrompt;

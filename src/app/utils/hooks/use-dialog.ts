import { useBoolean } from "react-use";

type State = {
  open: boolean;
  openDialog: () => void;
  closeDialog: () => void;
};

function useDialog(): State {
  const [open, setOpen] = useBoolean(false);

  const openDialog = () => setOpen(true);
  const closeDialog = () => setOpen(false);

  return {
    open,
    openDialog,
    closeDialog,
  };
}

export default useDialog;

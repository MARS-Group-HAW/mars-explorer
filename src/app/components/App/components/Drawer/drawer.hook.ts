import { useCallback } from "react";

type Props = {
  onPageChange: () => void;
};
type State = {
  handleClick: () => void;
};

function useDrawer({ onPageChange }: Props): State {
  const handleClick = useCallback(() => {
    onPageChange();
  }, []);

  return {
    handleClick,
  };
}

export default useDrawer;

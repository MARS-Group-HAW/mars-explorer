import { useBoolean } from "react-use";
import { MutableRefObject, useEffect } from "react";

type State = {
  isMenuOpen: boolean;
  closeMenu: () => void;
};

function useContextMenu(ref: MutableRefObject<HTMLDivElement>): State {
  const [isMenuOpen, setMenuOpen] = useBoolean(false);

  const openMenu = () => setMenuOpen(true);
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (!ref.current) return () => {};

    ref.current.addEventListener("contextmenu", openMenu);

    return () =>
      ref.current && ref.current.removeEventListener("contextmenu", openMenu);
  }, [ref.current]);

  return {
    isMenuOpen,
    closeMenu,
  };
}

export default useContextMenu;

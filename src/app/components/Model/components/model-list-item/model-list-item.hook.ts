import { useBoolean } from "react-use";
import { MutableRefObject, useEffect, useRef } from "react";

type State = {
  listItemRef: MutableRefObject<HTMLDivElement>;
  isMenuOpen: boolean;
  closeMenu: () => void;
};

function useModelListItem(): State {
  const listItemRef = useRef<HTMLDivElement>();

  const [isMenuOpen, setMenuOpen] = useBoolean(false);

  const openMenu = () => setMenuOpen(true);
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (!listItemRef.current) return () => {};

    listItemRef.current.addEventListener("contextmenu", openMenu);

    return () =>
      listItemRef.current &&
      listItemRef.current.removeEventListener("contextmenu", openMenu);
  }, [listItemRef.current]);

  return {
    listItemRef,
    isMenuOpen,
    closeMenu,
  };
}

export default useModelListItem;

import { useState } from "react";

type State<TabEnum> = {
  tab: TabEnum;
  handleTabChange: (tab: TabEnum) => void;
};

function useTabBar<TabEnum>(initialIndex: TabEnum): State<TabEnum> {
  const [tab, setTab] = useState<TabEnum>(initialIndex);

  return {
    tab,
    handleTabChange: setTab,
  };
}

export default useTabBar;

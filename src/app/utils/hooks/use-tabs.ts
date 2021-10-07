import { useState } from "react";

type State<TabEnum> = [tab: TabEnum, onTabChange: (tab: TabEnum) => void];

function useTabs<TabEnum>(initTab: TabEnum): State<TabEnum> {
  const [tab, setTab] = useState<TabEnum>(initTab);

  return [tab, setTab];
}

export default useTabs;

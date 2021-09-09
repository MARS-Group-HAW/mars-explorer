import useTabBar from "../../hooks/use-tab-bar";

enum TabIndizes {
  AGENTS,
  LAYERS,
}

type Tabs = {
  label: string;
  value: TabIndizes;
}[];

type State = {
  currentTab: TabIndizes;
  handleTabChange: (index: TabIndizes) => void;
  tabs: Tabs;
};

const tabs: Tabs = [
  {
    label: "Agents",
    value: TabIndizes.AGENTS,
  },
  {
    label: "Layers",
    value: TabIndizes.LAYERS,
  },
];

function useObjectsForm(): State {
  const { tab, handleTabChange } = useTabBar<TabIndizes>(TabIndizes.AGENTS);

  return {
    currentTab: tab,
    handleTabChange,
    tabs,
  };
}

export default useObjectsForm;

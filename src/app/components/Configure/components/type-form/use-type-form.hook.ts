import useTabBar from "../../hooks/use-tab-bar";

export enum TabIndizes {
  AGENTS = "AGENTS",
  LAYERS = "LAYERS",
  ENTITIES = "ENTITIES",
}

type Tabs = {
  label: string;
  value: TabIndizes;
}[];

type State = {
  tab: TabIndizes;
  tabs: Tabs;
  handleTabChange: (index: TabIndizes) => void;
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
  {
    label: "Entities",
    value: TabIndizes.ENTITIES,
  },
];

function useTypeForm(): State {
  const { tab, handleTabChange } = useTabBar<TabIndizes>(TabIndizes.AGENTS);

  return {
    tab,
    tabs,
    handleTabChange,
  };
}

export default useTypeForm;

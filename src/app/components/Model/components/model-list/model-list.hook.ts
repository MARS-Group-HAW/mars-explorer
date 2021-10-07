import {
  openModelCreation,
  useSharedModels,
} from "../../hooks/use-shared-models";
import useTabs from "../../../../utils/hooks/use-tabs";

export enum ModelTabs {
  MY_PROJECT,
  EXAMPLES,
}

type State = {
  tab: ModelTabs;
  onTabChange: (tab: ModelTabs) => void;
  showAddButton: boolean;
  onAddButtonClick: () => void;
};

function useModelList(): State {
  const [, dispatch] = useSharedModels();

  const [tab, setTab] = useTabs<ModelTabs>(ModelTabs.MY_PROJECT);

  const onAddButtonClick = () => dispatch(openModelCreation());

  return {
    tab,
    onTabChange: setTab,
    showAddButton: tab === ModelTabs.MY_PROJECT,
    onAddButtonClick,
  };
}

export default useModelList;

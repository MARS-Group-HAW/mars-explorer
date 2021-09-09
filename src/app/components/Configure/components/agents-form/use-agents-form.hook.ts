import { useField } from "formik";
import ObjectMappings from "../mappings-form/utils/types";
import useTabBar from "../../hooks/use-tab-bar";

type State = {
  agentNames: string[];
  selectedAgentNameIndex: number;
  selectedAgentNamespace: string;
  handleAgentNameSelect: (tab: number) => void;
};

function useAgentsForm(namespace: string): State {
  const [{ value }] = useField<ObjectMappings>(namespace);
  const { tab, handleTabChange } = useTabBar(0);

  const agentNamespace = `${namespace}[${tab}]`;

  return {
    agentNames: value.map(({ name }) => name),
    selectedAgentNameIndex: tab,
    selectedAgentNamespace: agentNamespace,
    handleAgentNameSelect: handleTabChange,
  };
}

export default useAgentsForm;

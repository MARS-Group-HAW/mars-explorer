import { useState } from "react";
import { Channel } from "@shared/types/Channel";
import { ModelRef } from "@shared/types/Model";
import { useAsync } from "react-use";

type State = {
  models: ModelRef[];
  loading: boolean;
  handleModelClick: (model: ModelRef) => void;
};

function useProjectList(): State {
  const [models, setModels] = useState<ModelRef[]>([]);

  const { loading } = useAsync(async () => {
    const exampleModels = await window.api.invoke<void, ModelRef[]>(
      Channel.GET_EXAMPLE_PROJECTS
    );
    setModels(exampleModels);
  }, []);

  const handleModelClick = (model: ModelRef) => {
    console.log("Model was clicked: ", model);
  };

  return { models, loading, handleModelClick };
}

export default useProjectList;

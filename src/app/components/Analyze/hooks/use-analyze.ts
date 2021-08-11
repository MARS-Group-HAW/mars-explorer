import { useEffect } from "react";

type Props = {
  setLoading: (isLoading: boolean) => void;
};

type State = void;

function useAnalyze(props: Props): State {
  useEffect(() => {
    props.setLoading(false);
  }, []);
}

export default useAnalyze;

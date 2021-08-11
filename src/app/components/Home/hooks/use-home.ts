import { useEffect } from "react";

type Props = {
  setLoading: (isLoading: boolean) => void;
};

type State = void;

function useHome(props: Props): State {
  useEffect(() => {
    props.setLoading(false);
  }, []);
}

export default useHome;

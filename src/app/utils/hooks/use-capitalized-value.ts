import { useState } from "react";

type State = [string, (value: string) => void];

function useCapitalizedValue(init: string = ""): State {
  const [value, setValue] = useState<string>(init);

  const setCapitalizedValue = (newValue: string) =>
    setValue(
      newValue.length === 1 ? newValue.charAt(0).toUpperCase() : newValue
    );

  return [value, setCapitalizedValue];
}

export default useCapitalizedValue;

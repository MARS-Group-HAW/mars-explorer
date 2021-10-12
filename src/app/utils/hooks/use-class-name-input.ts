import { useState } from "react";

type State = [string, (value: string) => void];

function useClassNameInput(init: string = ""): State {
  const [value, setValue] = useState<string>(init);

  const setCapitalizedValue = (newValue: string) => {
    if (newValue.length === 0) {
      setValue("");
      return;
    }

    if (!newValue.match(/^[a-z0-9]+$/i)) {
      console.log("no match for", newValue);
      return;
    }

    setValue(
      newValue.length === 1 ? newValue.charAt(0).toUpperCase() : newValue
    );
  };

  return [value, setCapitalizedValue];
}

export default useClassNameInput;

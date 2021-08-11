import * as React from "react";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import FormBox from "../form-box";
import useOutputsForm from "./outputs-form.hook";
import OutputSpecification from "./utils/types";
import OutputsCsvForm from "../output-csv-form";
import OutputsSqliteForm from "../output-sqlite-form";

type Props = {
  namespace: string;
};

function OutputsForm({ namespace }: Props) {
  const { value, handleChange, choices, name } = useOutputsForm(namespace);

  return (
    <FormBox>
      <Grid container direction="column" justifyContent="flex-end" spacing={2}>
        <Grid item xs={12}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Choose an output</FormLabel>
            <RadioGroup
              aria-label="output"
              name={name}
              value={value}
              onChange={handleChange}
              row
            >
              {choices.map((choice) => (
                <FormControlLabel
                  key={choice.value}
                  value={choice.value}
                  control={<Radio />}
                  label={choice.label}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          {value === OutputSpecification.NONE && "Nothing to show"}
          {value === OutputSpecification.CSV && (
            <OutputsCsvForm namespace={namespace} />
          )}
          {value === OutputSpecification.SQLITE && (
            <OutputsSqliteForm namespace={namespace} />
          )}
        </Grid>
      </Grid>
    </FormBox>
  );
}

export default OutputsForm;

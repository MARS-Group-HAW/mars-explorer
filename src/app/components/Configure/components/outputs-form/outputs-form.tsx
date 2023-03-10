import * as React from "react";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Link,
  Radio,
  RadioGroup,
  Typography,
} from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";
import FormBox from "../form-box";
import useOutputsForm from "./outputs-form.hook";
import { OutputSpecification } from "./utils/types";
import Path from "../../../App/utils/app-paths";

type Props = {
  namespace: string;
};

function OutputsForm({ namespace }: Props) {
  const { value, handleChange, choices, outputNamespace } =
    useOutputsForm(namespace);

  return (
    <FormBox>
      <Grid container spacing={2} style={{ height: "100%" }}>
        <Grid item xs={12}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Choose an output</FormLabel>
            <RadioGroup
              aria-label="output"
              name={outputNamespace}
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
          <Grid item xs={12}>
            {value === OutputSpecification.NONE && (
              <Typography variant="caption">
                No additional output selected. The results of your simulation
                will still be saved internally and can be analyzed in{" "}
                <Link component={RouterLink} to={Path.ANALYZE}>
                  Analyze
                </Link>
                .
              </Typography>
            )}
            {value === OutputSpecification.CSV && ( // TODO
              <Typography variant="caption">
                Insert explanation about CSV
              </Typography>
            )}
            {value === OutputSpecification.SQLITE && ( // TODO
              <Typography variant="caption">
                Insert explanation about SQLite
              </Typography>
            )}
          </Grid>
        </Grid>
        {/* TODO low priority
          <Grid item xs={12}>
          {value === OutputSpecification.NONE && <OutputsNoneForm />}
          {value === OutputSpecification.CSV && (
            <OutputsCsvForm namespace={optionsNamespace} />
          )}
          {value === OutputSpecification.SQLITE && (
            <OutputsSqliteForm namespace={optionsNamespace} />
          )}
        </Grid>
        */}
      </Grid>
    </FormBox>
  );
}

export default OutputsForm;

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
import OutputSpecification from "./utils/types";
import OutputsCsvForm from "../output-csv-form";
import OutputsSqliteForm from "../output-sqlite-form";
import Path from "../../../App/utils/AppPaths";
import StyledFileIcon from "./output-form-styles";

type Props = {
  namespace: string;
};

function OutputsForm({ namespace }: Props) {
  const { value, handleChange, choices, name, optionsNamespace } =
    useOutputsForm(namespace);

  return (
    <FormBox>
      <Grid container spacing={2} style={{ height: "100%" }}>
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
        <Grid item xs={12}>
          {value === OutputSpecification.NONE && (
            <StyledFileIcon fontSize="large" />
          )}
          {value === OutputSpecification.CSV && (
            <OutputsCsvForm namespace={optionsNamespace} />
          )}
          {value === OutputSpecification.SQLITE && (
            <OutputsSqliteForm namespace={optionsNamespace} />
          )}
        </Grid>
      </Grid>
    </FormBox>
  );
}

export default OutputsForm;

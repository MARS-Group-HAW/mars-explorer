import * as React from "react";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  makeStyles,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import ChartType from "../../utils/chart-type";

const useStyles = makeStyles(() => ({
  fieldSet: {
    height: "100%",
  },
  group: {
    height: "100%",
    justifyContent: "space-around",
  },
}));

type Props = {
  currentChartType: ChartType;
  onChartTypeChange: (type: ChartType) => void;
};

const chartTypeToLabel = (type: ChartType) => {
  switch (type) {
    case ChartType.LINE:
      return "Number of agents per progress (Line-Chart)";
    case ChartType.BUBBLE:
      return "Positions of agent at progress (Bubble-Chart)";
    default:
      return "No Label";
  }
};

function ChartSelector({ currentChartType, onChartTypeChange }: Props) {
  const classes = useStyles();

  return (
    <FormControl component="fieldset" className={classes.fieldSet}>
      <FormLabel component="legend">How to visualize?</FormLabel>
      <RadioGroup
        className={classes.group}
        value={currentChartType}
        onChange={(ev, value) => onChartTypeChange(value as ChartType)}
      >
        {Object.values(ChartType).map((type) => (
          <FormControlLabel
            key={type}
            value={type}
            control={<Radio />}
            label={chartTypeToLabel(type)}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}

export default ChartSelector;

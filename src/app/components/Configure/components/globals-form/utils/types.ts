enum TimeSpecification {
  STEP = "step",
  DATETIME = "date-time",
}

export default TimeSpecification;
export const ALL_TIME_UNITS = [
  "milliseconds",
  "seconds",
  "minutes",
  "hours",
  "days",
  "months",
  "years",
];
type TimeUnitTuple = typeof ALL_TIME_UNITS; // readonly ['hearts', 'diamonds', 'spades', 'clubs']
export type TimeUnit = TimeUnitTuple[number];

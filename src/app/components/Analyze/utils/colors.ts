const CHART_COLORS = [
  "green",
  "red",
  "blue",
  "orange",
  "purple",
  "yellow",
  "grey",
];
const colorLength = CHART_COLORS.length;

function getColorByIndex(index: number): string {
  const mod = index % colorLength;
  return CHART_COLORS[mod];
}

export default getColorByIndex;

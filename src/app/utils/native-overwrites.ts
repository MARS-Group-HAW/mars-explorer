import { format } from "date-fns";

// eslint-disable-next-line no-extend-native
Date.prototype.toJSON = function () {
  console.log("PARSING", this, format(this, "yyyy-MM-dd'T'HH:mm:ss"));
  return format(this, "yyyy-MM-dd'T'HH:mm:ss");
};

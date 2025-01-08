var btoa = require("btoa");

exports.encode = (b64) => {
  return { msg: "success", data: { value: btoa(b64) } };
};

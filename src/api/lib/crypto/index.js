const fromDecode = require("./b64/decoding");
const fromEncode = require("./b64/encoding");
const fromBcrypt = require("./bcrypt");
exports.crypto = {
  b64: {
    encode: fromEncode.encode,
    decode: fromDecode.decode,
  },
  PasswordHash: fromBcrypt.PasswordHash,
};

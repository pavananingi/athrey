const config = require("../../config/app.config.json");

async function bruteForce({
  CreateError,
  logger,
  translate,
  db,
  ipaddress,
  lang,
}) {
  try {
    const ipaddressTable = db.methods.Ipaddress({
      translate,
      logger,
      CreateError,
      lang,
    });
    let ipAddressObj;
    ipaddressesList = (
      await ipaddressTable.findByAddress({ ipaddress: ipaddress })
    ).data.ipaddresses;
    console.log(ipaddressesList);

    if (ipaddressesList == null) {
      ipAddressObj = (
        await ipaddressTable.create({
          address: ipaddress,
          invalidtry: 1,
          validtry_time: Date.now(),
        })
      ).data.ipaddresses;
    } else {
      if (ipaddressesList?.invalidtry == 0) {
        if (
          new Date(ipaddressesList.validtry_time).getTime() +
            config.blockedDuration * 1000 >
          Date.now()
        ) {
          throw new CreateError(translate(lang, "user_locked"), 401);
        } else {
          let status = await ipaddressTable.updateByAddress({
            ipaddress,
            params: {
              address: ipaddress,
              invalidtry: 1,
              validtry_time: Date.now(),
            },
          });
        }
      } else if (
        ipaddressesList.invalidtry >= config.numberOfBruteForceAttempts &&
        new Date(ipaddressesList.validtry_time).getTime() +
          config.bruteForceDuration * 1000 >
          Date.now()
      ) {
        let status = await ipaddressTable.updateByAddress({
          ipaddress,
          params: {
            address: ipaddress,
            invalidtry: 0,
            validtry_time: Date.now(),
          },
        });
        throw new CreateError(translate(lang, "user_locked"), 401);
      } else if (
        new Date(ipaddressesList.validtry_time).getTime() +
          config.bruteForceDuration * 1000 >
        Date.now()
      ) {
        let status = await ipaddressTable.updateByAddress({
          ipaddress,
          params: {
            address: ipaddress,
            invalidtry: ipaddressesList.invalidtry + 1,
            validtry_time: Date.now(),
          },
        });
      } else await ipaddressTable.deleteByAddress({ address: ipaddress });
    }
  } catch (error) {
    if (error instanceof CreateError) {
      throw error;
    }
    logger.error(`Failed to register doctor: %s`, error);
    throw new Error(error.message);
  }
}

async function checkBlocked({
  CreateError,
  logger,
  translate,
  db,
  ipaddress,
  lang,
}) {
  const ipaddressTable = db.methods.Ipaddress({
    translate,
    logger,
    CreateError,
    lang,
  });
  let ipAddressObj;
  ipaddressesList = (
    await ipaddressTable.findByAddress({ ipaddress: ipaddress })
  ).data.ipaddresses;
  console.log(ipaddressesList);

  if (ipaddressesList?.invalidtry == 0) {
    if (
      new Date(ipaddressesList.validtry_time).getTime() +
        config.blockedDuration * 1000 >
      Date.now()
    ) {
      throw new CreateError(translate(lang, "user_locked"), 401);
    }
  }
}

module.exports = { bruteForce, checkBlocked };

// const fs = require("fs");
// let status = 0;

// async function safeguardBruteAttack({
//   ipaddress,
//   lang,
//   CreateError,
//   translate,
//   logger,
// }) {
//   try {
//     if (ipaddress !== "") {
//       console.log("case 1");
//       fs.readFileSync(
//         "utils.json",
//         "utf8",
//         function readFileCallback(err, data) {
//           if (err) {
//             console.log(err);
//           } else {
//             obj = JSON.parse(data); //now it an object
//             const array = obj.data;
//             let userObj = array.filter(
//               (tempObj) => tempObj.address === ipaddress
//             );
//             if (userObj.length !== 0) {
//               console.log("case 2");
//               userObj = userObj[0];

//               if (
//                 userObj.invalidtry >= 2 &&
//                 new Date(userObj.validtry_time) > Date.now()
//               ) {
//                 throw new CreateError(translate(lang, "user_locked"), 401);
//                 console.log("case final");

//                 obj.data = array.filter(
//                   (tempObj) => tempObj.address !== ipaddress
//                 );
//                 json = JSON.stringify(obj);
//                 console.log(json); //convert it back to json
//                 fs.writeFile("utils.json", json, "utf8", (err) => {
//                   if (err) console.log("error is", err);
//                   else
//                     throw new CreateError(translate(lang, "user_locked"), 401);
//                 });

//                 // write it back
//               } else {
//                 console.log("case 3");
//                 const NewObj = {
//                   address: userObj.address,
//                   invalidtry: userObj.invalidtry + 1,
//                   validtry_time: new Date(Date.now() + 500000),
//                 };

//                 for (let i = 0; i < obj.data.length; i++) {
//                   if (obj.data[i].address === ipaddress) {
//                     obj.data[i] = NewObj;
//                   }
//                 }
//                 json = JSON.stringify(obj); //convert it back to json
//                 fs.writeFileSync("utils.json", json, "utf8", (err) => {
//                   if (err) console.log(err);
//                   else
//                     throw new CreateError(
//                       translate(lang, "invalid_login_credentials"),
//                       401
//                     );
//                   return 0;
//                 }); // write it back
//               }
//             } else {
//               console.log("case 4");
//               obj.data.push({
//                 address: ipaddress,
//                 invalidtry: 1,
//                 validtry_time: new Date(Date.now() + 500000),
//               }); //add some data
//               json = JSON.stringify(obj); //convert it back to json
//               fs.writeFileSync("utils.json", json, "utf8", (err) => {
//                 if (err) console.log(err);
//                 else console.log("Successful");
//                 return 0;
//               }); // write it back
//             }
//           }
//           console.log("finished");
//         }
//       );
//     }
//   } catch (error) {
//     console.log("Helloooooo");
//     if (error instanceof CreateError) {
//       throw error;
//     }
//     throw new Error(translate(lang, "error_unknown"));
//   }
// }

// module.exports = safeguardBruteAttack;

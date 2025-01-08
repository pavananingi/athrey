const path = require("path");
const express = require("express");
const logMorgan = require("./utils/logger").logMorgan;
const http = require("http");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const appConfig = require("./config/app.config.json");
const app = express();
const server = http.createServer(app);
const helmet = require("helmet");
const frameguard = require("frameguard");

// routers
const routes = require("./api/routes");
const middlewares = require("./api/middlewares");
const fromCtrl = require("./api/controllers");

// error handler
const errorHandler = require("./error/error-handler").errorHandler;

const allowedMethods = ["GET", "POST", "DELETE", "PATCH", "OPTIONS"];

// app.get("/abc", async (req, res) => {
//   console.log(req.headers["x-forwarded-for"]);
//   res.status(200).send({
//     headers: req.headers["x-forwarded-for"],
//   });
// });

app.disable("x-powered-by");
app.set("x-powered-by", false);
// app.use((req, res, next) => {
//   if (req.method.toUpperCase() === "OPTIONS") {
//     return res.status(405).send("Method not allowed").end();
//   }
//   next();
// });

app.use((req, res, next) => {
  if (!allowedMethods.includes(req.method)) {
    return res.status(405).send("Method not allowed");
  }
  next();
});

const originURLS = [
  appConfig.originUrl[process.env.NODE_ENV].https,
  appConfig.originUrl[process.env.NODE_ENV].http,
  appConfig.originUrl[process.env.NODE_ENV].www.https,
  appConfig.originUrl[process.env.NODE_ENV].www.http,
  "http://localhost:4200",
  "https://localhost:4200",
  "https://athrey-wdev.edalytics.com",
  "http://athrey-wdev.edalytics.com",
  "https://tranquil-kulfi-500975.netlify.app",
  "http://tranquil-kulfi-500975.netlify.app",
  "http://athrey-dev.web.app",
  "https://athrey-dev.web.app"
];

//
console.log("App", "Allowed URLs", originURLS);

app.use(cookieParser());
app.use(logMorgan); // logger


// allow origins middlewares
app.use(cors({
  origin: function (origin, callback) {
    if (originURLS.indexOf(origin) !== -1) {
      callback(null, true)
    } else if (origin === "") {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS:' + origin))
    }
  },
  credentials: true,
  methods: "GET,POST,DELETE,PATCH,OPTIONS",
}));

app.use(frameguard({ action: "deny" }));
app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [
        "'self'",
        "blob:",
        "data:",
        "mediastream:",
        "https://cloud.apizee.com/",
        "https://ccs5.apizee.com/",
        "https://ccs6.apizee.com/",
        "https://api.stripe.com/",
        "https://hooks.stripe.com/",
        "https://js.stripe.com/",
        "http://localhost:4200",
        "https://athrey-wdev.edalytics.com",
        "wss://ccs5.apizee.com/",
        "wss://ccs6.apizee.com/",
        // 'https://firestore.googleapis.com/',
        "https://js.stripe.com",
        "https://www.googleapis.com",
        "https://securetoken.googleapis.com/",
        "https://obs.eu-de.otc.t-systems.com",
        "https://dp-dev.obs.eu-de.otc.t-systems.com",
        "https://dp-assets.obs.eu-de.otc.t-systems.com",
        // fbConfig[process.env.NODE_ENV].database_url,
        ...originURLS,
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://athrey-wdev.edalytics.com",
        "https://fonts.googleapis.com/",
        "https://stackpath.bootstrapcdn.com/",
        "https://code.jquery.com/",
        "https://use.fontawesome.com",
      ],
      fontSrc: ["'self'", "https://fonts.gstatic.com/"],
      scriptSrc: [
        "'self'",
        "'unsafe-eval'", "'unsafe-inline'",
        "https://cdnjs.cloudflare.com/",
        "https://code.jquery.com/",
        "https://cloud.apizee.com/",
        "https://unpkg.com/",
        "https://ccs5.apizee.com/",
        "https://ccs6.apizee.com/",
        "https://stackpath.bootstrapcdn.com/",
        "https://cdn.jsdelivr.net/",
        "https://js.stripe.com/",
        "https://cdn.apirtc.com/",
      ],
      // imgSrc: [
      //   "'self'", "blob:",
      // ]
      // connectSrc: ["'self'",
      //   'wss://ccs5.apizee.com/'
      // ]
    },
  })
);

// enable cors
// app.use(cors({
//     credentials: true
// }));

//
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json

// app.use(express.static(path.join(__dirname, "..", "dist"))); // static files

app.use(function (req, res, next) {
  res.locals.ua = req.get("User-Agent");
  next();
});

app.use((req, res, next) => {
  res.locals.origin = req.headers.origin || "";
  // console.log(req.headers.origin, ':', req.socket.remoteAddress);
  next();
});

app.use("/api/:language", middlewares.setLanguage);
app.use("/api/:language/v1/auth", routes.auth);
app.use("/api/:language/v1/profile", middlewares.isLogged, routes.profile);
app.use("/api/:language/v1/devices", middlewares.isLogged, routes.devices);
app.use("/api/:language/v1/insurances", middlewares.isLogged, routes.insurance);
app.use("/api/:language/v1/doctors", middlewares.isLogged, routes.doctor);
app.use("/api/:language/v1/admins", routes.admin);
app.use(
  "/api/:language/v1/categories",
  middlewares.isLogged,
  routes.treatments
);

app.use(
  "/api/:language/v1/consultations",
  middlewares.isLogged,
  routes.consultations
);
app.use("/api/:language/v1/tempuser", routes.tempUser);
app.use("/api/:language/v1/logs", middlewares.isLogged, routes.logs);
app.use("/api/:language/v1/plans", routes.appPlans);
app.use("/api/:language/v1/payment", routes.payment);

app.use("/api/:langugae/v1/token", middlewares.isLogged, routes.token);
app.use("/api/:language/v1/documents", routes.documents);
app.use(
  "/api/:language/v1/medicalRates",
  middlewares.isLogged,
  routes.medicalRates
);

app.post(
  "/api/:language/v1/upload",
  middlewares.isLogged,
  fromCtrl.private.postGenerateUrls
);
app.use("/api/:language/v1", middlewares.isLogged, routes.common);

app.use(errorHandler);

app.all('*', (req, res) => {
  res.send('Welcome to Athrey service!!');
});
// app.all("*", (req, res) => {
//   return res
//     .status(200)
//     .sendFile(path.join(__dirname, "..", "dist", "index.html"));
// });

module.exports = {
  app,
  server,
};

let bodyParser = require("body-parser");
let express = require("express");
let app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// parse application/json
app.use(bodyParser.json());

app.use(require("./controller/borrowerController"));

app.listen(3000);
console.log("Server running in port: 3000 ...");

const functions = require("firebase-functions");
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const upload = multer();

const checklistRouter = require("./controllers/checklistRouter");
const taskRouter = require("./controllers/taskRouter");

const ampCors = require("@ampproject/toolbox-cors");

const cors = require("cors");

const app = express();
app.use(
    ampCors({
        email: true,
        verifyOrigin: false
    })
);

const admin = require("firebase-admin");
admin.initializeApp();

// const corsOptions = {
//     origin: function (origin, callback) {
//         if (whitelist.indexOf(origin) !== -1) {
//             return callback(null, true);
//         } else {
//             return callback(new Error("Not allowed by CORS"));
//         }
//     }
// };
// app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.array());
app.use(express.static("public"));

app.use((req, res, next) => {
    res.set("AMP-Access-Control-Allow-Source-Origin", "amp@gmail.dev");
    res.set(
        "Access-Control-Expose-Headers",
        "AMP-Access-Control-Allow-Source-Origin"
    );
    res.set("Access-Control-Allow-Credentials", true);
    next();
});
app.use("/api/task", taskRouter);
app.use("/api/task", checklistRouter);
exports.app = functions.https.onRequest(app);

const functions = require("firebase-functions");

const config = {
    sendgrid: {
        apiKey: "", //functions.config().sendgrid.apikey,
        from_address: "ash@tablehq.com"
        //  functions.config().sendgrid.from_address || "ash@tablehq.com"
    }
};

module.exports = config;

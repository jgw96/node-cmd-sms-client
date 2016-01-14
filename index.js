"use strict";

//twilio setup
const accountSid = "You need one";
const authToken = "you need one";
const twilio = require('twilio');
const client = new twilio.RestClient(accountSid, authToken);

//express setup
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

//extra deps
const prompt = require("prompt");
const notifier = require("node-notifier");

//needed for twilio api
app.use(bodyParser.urlencoded({ extended: true }));

//receive calls
app.post('/inbound', (request, response) => {
    notifier.notify({
        "title": "Ring Ring",
        "message": "Call recieved"
    });
    console.log("call recieved");
    
    //respond to call
    prompt.start();
    prompt.get(['callResponse'], (err, result) => {
        if (err) {
            throw err;
        }
        else {
            console.log('Command-line input received:');
            console.log(`response: ${result.callResponse}`);

            response.type('text/xml');
            response.send(`<Response><Say>${result.callResponse}.</Say></Response>`);
        }
    });

});

//receive texts
app.post("/textInbound", (request, response) => {
    notifier.notify({
        "title": `New text from ${request.body.From}`,
        "message": request.body.Body,
        "sound": true
    });
    console.log(`text recieved from ${request.body.From}`);
    console.log(request.body.Body);
    
    //respond to text
    prompt.start();
    prompt.get(["textResponse"], (err, result) => {
        if (err) {
            throw err;
        }
        else {
            console.log("Command-line input recieved:");
            console.log(`response: ${result.textResponse}`);

            response.type("text/xml");
            response.send(`<Response><Message>${result.textResponse}.</Message></Response>`);
        }
    });
});

app.listen(3000);

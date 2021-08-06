"use strict";
// TODO: WORK LEAN
// implement save data to file/ memory/ db
// implement dotenv
// spawn some questions data
// add swagger / docs
// ts?
// logger?
// TDD?
exports.__esModule = true;
var express_1 = require("express");
var app = express_1["default"]();
var port = 3000;
app.get('/', function (req, res) {
    res.status(200).send("hello");
});
app.get('/question/:id', function (req, res) {
    res.send('return The question metadata!');
});
app.post('/question/voted/:id', function (req, res) {
    res.send('return Number of votes per answer');
});
app.put('/question/', function (req, res) {
    res.send('returns The created question ID');
});
app.listen(port, function () {
    console.log("Example app listening at http://localhost:" + port);
});

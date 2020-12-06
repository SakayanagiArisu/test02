var express = require("express");
var app = express();
var PORT = process.env.PORT || 3000; // bardzo istotna linijka - port zostaje przydzielony przez Heroku

var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true })); 

app.use(express.static('static'));

var users = [
    {log: 'aaa', pass: 'qwerty', uczen: 'checked', plec: 'm', id: 1, wiek: 18},
    {log: 'bbb', pass: '1234', uczen: 'checked', plec: 'k', id: 2, wiek: 12},
    {log: 'miki2008', pass: 'super', uczen: '', plec: 'm', id: 3, wiek: 14},
    {log: 'ania', pass: 'ania', uczen: '', plec: 'k', id: 4, wiek: 13}
]

var active = null;

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/static/index.html'));
})

app.get("/register", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/register.html"));
})

app.get("/login", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/login.html"));
})

app.get("/admin", function (req, res) {
    if(active == 'aaa'){
        res.sendFile(path.join(__dirname + "/static/admin.html"));
    }else{
        res.sendFile(path.join(__dirname + "/static/error.html"));
    }
})

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT);
})
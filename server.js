var express = require("express");
var app = express();
var PORT = process.env.PORT || 3000; // bardzo istotna linijka - port zostaje przydzielony przez Heroku

var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true })); 

app.use(express.static('static'));

var path = require("path")

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

app.post("/register", function(req, res){
    let test = false;
    for(let i = 0; i < users.length; i++){
        if(users[i]['log'] == req.body.login){
            test = true;
            break;
        }
    }
    if(test){
        res.send('Już istnieje użytkownik o takim loginie')
    }else{
        let x = req.body;
        let id = users.length + 1;
        let student;
        if(x.student == undefined){
            student = '';
        }else{
            student = 'checked';
        }
        users.push({log: x.login, pass: x.password, uczen: student, plec: x.gender, id: id, wiek: parseInt(x.age)});
        res.send('Zarejestrowano pomyślnie');
    }
})

app.get("/login", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/login.html"));
})

app.post("/login", function(req, res){
    let test = true;
    it = null;
    for(let i = 0; i < users.length; i++){
        if(users[i]['log'] == req.body.login && users[i]['pass'] == req.body.password){
            test = false;
            active = users[i]['log'];
            res.send('Zalogowano pomyślnie')
            break;
        }
    }
    if(test){
        res.send('Nie ma użytkownika o takim loginie i haśle');
    }
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
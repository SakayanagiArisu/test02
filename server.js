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

app.get("/show", function (req, res) {
    if(active == 'aaa'){
        let html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
            <link rel="stylesheet" href="css/style.css">
            <style>
                body{
                    margin: 0;
                    background-color: darkgray;
                }
            </style>
        </head>
        <body>
            <div class='header'>
                <div class='container'>
                    <a href='/show'>show</a>
                    <a href='/gender'>gender</a>
                    <a href='/sort'>sort</a>
                </div>
            </div>
            <table>
        `;
        for(let i = 0; i < users.length; i++){
            let p = `<tr><td>id: ${users[i]['id']}</td><td>user: ${users[i]['log']} - ${users[i]['pass']}</td><td>uczen: <input type='checkbox' ${users[i]['uczen']} disabled></td><td>wiek: ${users[i]['wiek']}</td><td>płeć: ${users[i]['plec']}</td></tr>`;
            html += p;
        }
        html += '</table></body></html>';
        res.send(html);
    }else{
        res.sendFile(path.join(__dirname + "/static/error.html"));
    }
})

app.get("/gender", function (req, res) {
    if(active == 'aaa'){
        let p = ''
        let r = ''
        for(let i = 0; i < users.length; i++){
            if(users[i]['plec'] == 'k'){
                p += `<tr><td>id: ${users[i]['id']}</td><td>płeć: ${users[i]['plec']}</td></tr>`
            }else{
                r += `<tr><td>id: ${users[i]['id']}</td><td>płeć: ${users[i]['plec']}</td></tr>`
            }
        }
        let html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
            <link rel="stylesheet" href="css/style.css">
            <style>
                body{
                    margin: 0;
                    background-color: darkgray;
                }
            </style>
        </head>
        <body>
            <div class='header'>
                <div class='container'>
                    <a href='/show'>show</a>
                    <a href='/gender'>gender</a>
                    <a href='/sort'>sort</a>
                </div>
            </div>
            <table>
            ${p}
            </table><br>
            <table>
            ${r}
            </table>
        </body>
        </html>
        `;
        res.send(html);
    }else{
        res.sendFile(path.join(__dirname + "/static/error.html"));
    }
})

app.get("/sort", function (req, res) {
    if(active == 'aaa'){
        let Tab1 = [...users]
        let Tab2 = []
        while(Tab2.length < users.length){
            let p = 0;
            let id = null;
            for(let i = 0; i < Tab1.length; i++){
                if(Tab1[i]['wiek'] > p){
                    p = Tab1[i]['wiek'];
                    id = i;
                }
            }
            Tab2.push(Tab1[id]);
            Tab1.splice(id, 1);
        }
        let html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
            <link rel="stylesheet" href="css/style.css">
            <style>
                body{
                    margin: 0;
                    background-color: darkgray;
                }
            </style>
        </head>
        <body>
            <div class='header'>
                <div class='container'>
                    <a href='/show'>show</a>
                    <a href='/gender'>gender</a>
                    <a href='/sort'>sort</a>
                </div>
            </div>
            <table>
        `;
        for(let i = 0; i < Tab2.length; i++){
            let p = `<tr><td>id: ${Tab2[i]['id']}</td><td>user: ${Tab2[i]['log']} - ${Tab2[i]['pass']}</td><td>uczen: <input type='checkbox' ${Tab2[i]['uczen']} disabled></td><td>wiek: ${Tab2[i]['wiek']}</td><td>płeć: ${Tab2[i]['plec']}</td></tr>`;
            html += p;
        }
        html += '</table></body></html>';
        res.send(html);
    }else{
        res.sendFile(path.join(__dirname + "/static/error.html"));
    }
})

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT);
})
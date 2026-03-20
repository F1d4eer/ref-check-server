require('dotenv').config()
const express = require('express')
const sqlite3 = require('sqlite3').verbose()

const app = express()

const db = new sqlite3.Database('./db.db')

// создаем таблицу
db.run(`
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    telegram_id TEXT
)
`)

// POSTBACK от 1Win
app.get('/postback', (req, res) => {

const telegram_id = req.query.subid

if(!telegram_id){
return res.send("no subid")
}

db.run(
"INSERT INTO users (telegram_id) VALUES (?)",
[telegram_id]
)

console.log("NEW REF:", telegram_id)

res.send("ok")

})

// Проверка для бота
app.get('/check', (req, res) => {

const telegram_id = req.query.id

db.get(
"SELECT * FROM users WHERE telegram_id=?",
[telegram_id],
(err,row)=>{

if(row){
res.json({access:true})
}else{
res.json({access:false})
}

})

})

app.listen(3000, ()=> console.log("Server started"))

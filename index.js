const db = require("./db")
const express = require("express")

const app = express()

app.use(express.json())

app.get("/", (_, res) => {
    res.send("Hello world")
})

app.post("/", (req, res) => {
    console.log(req.body)
    res.send("Успех")
})

app.get("/users", (_, res) => {
    const data = db.prepare("SELECT * FROM users").all()
    res.json(data)
})

app.post("/users", (req, res) => {
    const { email, name } = req.body

    try {
        if (!email || !name) {
            return res.status(400).json({ error: "Не хватает данных" })
        }
        const query = db.prepare(`INSERT INTO users (email, name) VALUES (?, ?)`)
        const info = query.run(email, name)
        const newUser = db.prepare(`SELECT * FROM users WHERE ID = ?`).get(info.lastInsertRowid)
        res.status(201).json(newUser)
    } catch (error) {}
})

app.delete("/users/:id", (req, res) => {
    const {id} = req.params
    const query = db.prepare (`DELETE FROM users WHERE id = ?`)
    const result = query.run(id)
    if (result.changes === 0) res.status(404).json({error:"Пользователь не был найден"})
    res.status(200).json({message:"Пользователь успешно удален"})
})

////////

app.get("/tydy", (_, res) => {
    const data = db.prepare("SELECT * FROM tydy").all()
    res.json(data)
})

app.post("/tydy", (req, res) => {
    const {status, name } = req.body

    try {
        if (!status || !name) {
            return res.status(400).json({ error: "Не хватает данных" })
        }
        const query = db.prepare(`INSERT INTO tydy (status, name) VALUES (?, ?)`)
        const info = query.run(status, name)
        const newUser = db.prepare(`SELECT * FROM tydy WHERE ID = ?`).get(info.lastInsertRowid)
        res.status(201).json(newUser)
    } catch (error) {}
})

app.delete("/tydy/:id", (req, res) => {
    const {id} = req.params
    const query = db.prepare (`DELETE FROM tydy WHERE id = ?`)
    const result = query.run(id)
    if (result.changes === 0) res.status(404).json({error:"Пользователь не был найден"})
    res.status(200).json({message:"Пользователь успешно удален"})
})


app.patch("/tydy/:id/toggle",(req, res) => {
    try {
        const {id} = req.params
        const query = db.prepare(`UPDATE tydy SET status = 1 - status WHERE id = ?`)
        const result = query.run(id)

        if (result.changes === 0) res.status(404).json({error: "Задачи не было найдено"})
            res.status(200).json({message:"Задача обновлена"})
    } catch (error) {
        console.error(error)
    }
})

app.patch("/users/:id",(req, res) => {
    try {
        const {id} = req.params
        const {name} = req.body
        const query = db.prepare(`UPDATE users SET name = ?  WHERE id = ?`)
        const result = query.run(name, id)

        if (result.changes === 0) res.status(404).json({error: "Имя не обновлено"})
            res.status(200).json({message:"Имя обновлено"})
    } catch (error) {
        console.error(error)
    }
})

app.get("/tydy/:id", (req, res) => {
    try {
        const {id} = req.params
        const query = db.prepare(`SELECT * FROM tydy WHERE id = ?`).all(id)
        
        if (query.length === 0) res.status(404).json({error: "404"})

        res.status(200).json(query)
    } catch (error) {
        console.error(error)
    }
})
///////

app.listen("3000", () => {
    console.log("Сервер запущен на порту 3000")
})
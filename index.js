

// TODO: WORK LEAN
// implement save data to file/ memory/ db
// implement dotenv
// spawn some questions data
// add swagger / docs
// ts?
// logger?
// TDD?

const express = require('express')
const app = express()
const port = 3000

app.get('/question/:id', (req, res) => {
    res.send('return The question metadata!')
})

app.post('/question/voted/:id', (req, res) => {
    res.send('return Number of votes per answer')
})

app.put('/question/', (req, res) => {
    res.send('returns The created question ID')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

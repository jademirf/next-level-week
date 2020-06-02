import express from 'express'

const app = express()

app.get('/users', (req, res) => {
    res.json([
        'usuário 01',
        'usuário 02',
        'usuário 03',
        'usuário 04',
        'usuário 05',
        'usuário 06'
    ])
})

app.listen(3333)
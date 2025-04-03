import { response } from "express";

const express = require('express')
const app = express()
// const port = process.env.SERVER_PORT;
const port = 3001;

app.get('/', (req: Request, res: Response) => {
    response.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
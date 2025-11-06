const express = require('express')
const cors = require('cors')
const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.json({ message: 'Hello from the backend!' });
});


app.listen(PORT, ()=>{
    console.log(`Server is listening on http://localhost:${PORT}`)
})
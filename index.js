const express = require('express');
require('dotenv').config()
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;


// Middle Ware
app.use(express.json());
app.use(cors());




app.get('/', (req, res) => {
    res.send("Server Is Running Hot!")

});
app.listen(port, () => {
    console.log(`Server is running port: ${port}`)
});


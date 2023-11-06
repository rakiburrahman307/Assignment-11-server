const express = require('express');
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;


// Middle Ware
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5000'],
    credentials: true,
}));


console.log(process.env.USER_DB);

const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.USER_PASS}@cluster0.044ysfk.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();


        const jobsCollections = client.db('jobs').collection('all_jobs');

        app.get('/all_jobs', async (req, res) => {
            const cursor = jobsCollections.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        app.post('/all_jobs', async (req, res) => {
            const newProduct = req.body;
            console.log(newProduct);
            const result = await jobsCollections.insertOne(newProduct)
            res.send(result);
        });





        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);








app.get('/', (req, res) => {
    res.send("Server Is Running Hot!")

});
app.listen(port, () => {
    console.log(`Server is running port: ${port}`)
});


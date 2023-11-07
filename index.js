const express = require('express');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
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

        // Database and Collection 
        const jobsCollections = client.db('jobs').collection('all_jobs');
        const appliedJobsCollections = client.db('jobs').collection('applied_jobs');
        // Get the all Of jobs 
        app.get('/all_jobs', async (req, res) => {
            const cursor = jobsCollections.find();
            const result = await cursor.toArray();
            res.send(result);
        });
        // Post a new Jobs 
        app.post('/all_jobs', async (req, res) => {
            const newJobs = req.body;
            const result = await jobsCollections.insertOne(newJobs)
            res.send(result);
        });
        // Get job by Id 
        app.get('/all_jobs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await jobsCollections.findOne(query);
            res.send(result);
          });
        //   $inc implement here 
          app.put('/all_jobs/:id', async (req, res) => {
            const id = req.params.id;
            const number = req.body;
            const query = { _id: new ObjectId(id) };
            const updateDoc = {
              $inc: { applicantsNumber: 1 },
            };
            const options = { new: true };
            const result = await jobsCollections.findOneAndUpdate(query, updateDoc, options);
            res.send(result);
          });
      

        //   Get the all applied job collection 
          app.get('/applied_job', async (req, res) => {
            const cursor = appliedJobsCollections.find();
            const result = await cursor.toArray();
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


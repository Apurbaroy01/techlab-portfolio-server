const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.port || 5000;


app.use(cors())
app.use(express.json())



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://techlabs12:techlabs12@cluster0.4gy1j38.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
        await client.connect();
        console.log("Pinged your deployment. You successfully connected to MongoDB✅!");

        const userCollection = client.db("techlabs").collection("users");
        const heroCollection = client.db("techlabs").collection("hero");
        const teamCollection = client.db("techlabs").collection("teamMembers");

        // user api--------------------------
        app.post('/users', async (req, res) => {
            const body = req.body;
            console.log(body)
            const result = await userCollection.insertOne(body)
            res.send(result);
        })

        app.patch('/users', async (req, res) => {
            const email = req.body.email
            console.log(email)
            const query = { email }
            const updateDoc = {
                $set: {
                    lastSignInTime: req.body.login_time
                },
            };
            const result = await userCollection.updateOne(query, updateDoc);
            res.send(result)


        })

        app.get('/users', async (req, res) => {
            const result = await userCollection.find().toArray();
            res.send(result);
        })

        // hero api--------------------------

        // app.post('/hero', async(req, res) => {
        //     const body = req.body;
        //     console.log(body)
        //     const result =await heroCollection.insertOne(body)
        //     res.send(result);
        // })

        app.get('/hero', async(req, res) => {
            const result =await heroCollection.find().toArray();
            res.send(result);
        })

        app.patch('/hero/:id', async (req, res) => {
            const id = req.params.id;

            const { companies, projects, subtitle, tagline, title, years } = req.body;
            console.log(req.body)
            
            const query = { _id: new ObjectId(id) }
            const updateDoc = {
                $set: {
                    companies, projects, subtitle, tagline, title, years
                },
            };
            const result = await heroCollection.updateOne(query, updateDoc);
            res.send(result)
        });

        // team member api--------------------------

        app.post('/teamMembers', async(req, res) => {
            const body = req.body;
            console.log(body)
            const result =await teamCollection.insertOne(body)
            res.send(result);
        });

        app.get('/teamMembers', async(req, res) => {
            const result =await teamCollection.find().toArray();
            res.send(result);
        });

        app.delete('/teamMembers/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await teamCollection.deleteOne(query);
            res.send(result);
        });


    }
    catch (error) {
        console.error("error❌", error.message)
    }
}
run();


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

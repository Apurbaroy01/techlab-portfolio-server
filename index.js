const express = require('express')
const cors = require('cors')
const app = express()
const dotenv = require('dotenv');
const nodemailer = require("nodemailer");
const port = process.env.PORT || 5000;
dotenv.config();

app.use(cors())
app.use(express.json())

const emailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_APP_PASS,
    },
});

app.post('/replyMessage', async (req, res) => {
    const { email, name, subject, replyMessage } = req.body;

    const paymentInfo = {
        name: name,
        user: email,
        subject: subject,
        replyMessage: replyMessage,
    }
    console.log(paymentInfo)

    const emailObj = {
        from: `"zap email sender"${process.env.ZAP_EMAIL}`,
        to: paymentInfo.user,
        name: name,
        subject: subject,
        html: `
            <P> Thank you for your  message </p>
            <br/>
            <br/>
            <h1>${replyMessage}<h1/>
            
        `
    }


    try {
        const emailInfo = await emailTransporter.sendMail(emailObj)
        console.log("email send", emailInfo.messageId)
        res.send({ result: "success" })
    }
    catch (err) {
        console.log("email send error")
        res.send({ result: 'email filed' })
    }
})



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.4gy1j38.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        // await client.connect();
        // console.log("Pinged your deployment. You successfully connected to MongoDB✅!");

        const userCollection = client.db("techlabs").collection("users");
        const heroCollection = client.db("techlabs").collection("hero");
        const teamCollection = client.db("techlabs").collection("teamMembers");
        const projectsCollection = client.db("techlabs").collection("projects");
        const servicesCollection = client.db("techlabs").collection("services");
        const contactMessageCollection = client.db("techlabs").collection("contactMessage");

        // user api--------------------------
        app.post('/users', async (req, res) => {
            const body = req.body;
            console.log(body)
            const result = await userCollection.insertOne(body)
            res.send(result);
        })

        app.patch('/users', async (req, res) => {
            const email = req.body.email
            const query = { email: email }
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

        app.get('/hero', async (req, res) => {
            const result = await heroCollection.find().toArray();
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

        app.post('/teamMembers', async (req, res) => {
            const body = req.body;
            console.log(body)
            const result = await teamCollection.insertOne(body)
            res.send(result);
        });

        app.get('/teamMembers', async (req, res) => {
            const result = await teamCollection.find().toArray();
            res.send(result);
        });

        app.delete('/teamMembers/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await teamCollection.deleteOne(query);
            res.send(result);
        });

        // projects api--------------------------

        app.post('/projects', async (req, res) => {
            const body = req.body;
            console.log(body)
            const result = await projectsCollection.insertOne(body)
            res.send(result);
        });

        app.get('/projects', async (req, res) => {
            const result = await projectsCollection.find().toArray();
            res.send(result);
        });

        app.delete('/projects/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await projectsCollection.deleteOne(query);
            res.send(result);
        });

        // services api--------------------------

        app.post('/services', async (req, res) => {
            const body = req.body;
            console.log(body)
            const result = await servicesCollection.insertOne(body)
            res.send(result);
        });

        app.get('/services', async (req, res) => {
            const result = await servicesCollection.find().toArray();
            res.send(result);
        });

        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.send(result);
        });

        // contact message api--------------------------
        app.post('/contactMessage', async (req, res) => {
            const body = req.body;
            console.log(body)
            const result = await contactMessageCollection.insertOne(body)
            res.send(result);
        });

        app.get('/contactMessage', async (req, res) => {
            const result = await contactMessageCollection.find().toArray();
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

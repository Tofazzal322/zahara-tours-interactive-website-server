const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const mongoUser = process.env.DB_USER
const mongoPass = process.env.DB_PASS

const app = express();
const port = process.env.PORT || 5000;

//  Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${mongoUser}:${mongoPass}@cluster0.i6saz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {

    try {
        await client.connect();
        const database = client.db('zahara-tours');
        const packagesCollection = database.collection('packages');
         const bookingCollection = database.collection('booking');

        // GET API
        app.get('/packages', async (req, res) => {
            const cursor = packagesCollection.find({});
            const services = await cursor.toArray();
            res.json(services);
        });

        // GET Single Package
        app.get('/packages/:bookId', async (req, res) => {
            const id = req.params.bookId;
            console.log('getting specific service', id);
            const query = { _id: ObjectId(id) };
            const service = await packagesCollection.findOne(query);
            res.send(service);
        })

        // POST Packages collection API
        /////////////////////////////
        app.post('/packages', async (req, res) => {
            const service = req.body;
            const result = await packagesCollection.insertOne(service);
            res.json(result)
        });

        
        // POST Booking collection  API
        app.post('/booking', async (req, res) => {
            const service = req.body;
            const result = await bookingCollection.insertOne(service);
            res.json(result)
        });

        // My Booking manage  Api
        app.get("/booking/:email", async (req, res) => {
          const result = await bookingCollection
            .find({
              email: req.params.email,
            })
            .toArray();
          res.send(result);
        });
        

        //  Manage All Booking & Tours
        app.get("/booking", async (req, res) => {
            const result = await bookingCollection.find({}).toArray();
            res.json(result);
        });

        
           // DELETE Single booking  API
        app.delete('/booking/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bookingCollection.deleteOne(query);
            res.json(result);
        })

        
        app.delete('/packages/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await packagesCollection.deleteOne(query);
            res.json(result);
        })



        //  Search Packages

        // app.get("/packages", async (req, res) => {
        //     const result = await bookingCollection.find({
        //     title: { $regex: req.query.search },
        //     }).toArray();
        //     res.json(result);
            
        // });


    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Zahara Tours Server is running ');
});



app.listen(port, () => {
    console.log(' Server Running on port', port);
})


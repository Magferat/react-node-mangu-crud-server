const express = require('express');
const cors = require('cors');

const app = express();
const ObjectId = require('mongodb').ObjectId;

const { MongoClient } = require('mongodb');
const port = 5000;

app.use(cors());
app.use(express.json())

//mydbuser1
//pass : L1WrNaGi2HDh5BM2

const uri = "mongodb+srv://mydbuser1:L1WrNaGi2HDh5BM2@cluster0.1rrt8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("foodmaster");
        const usersCollection = database.collection('users');
        //--------- Get Api ---------
        app.get('/users', async (req, res) => {
            const cursors = usersCollection.find({});
            const users = await cursors.toArray();
            res.send(users);
        })

        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const user = await usersCollection.findOne(query)
            console.log('load user with id:', id)
            res.send(user)
        })

        // ---------Post Api ---------
        app.post('/users', async (req, res) => {
            const newUser = req.body;

            const result = await usersCollection.insertOne(newUser);
            console.log('hitting the post', req.body);
            console.log(result);

            res.json(result)
        })
        //UPDATE API
        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updatedUser.name,
                    email: updatedUser.email
                },
            };
            const result = await usersCollection.updateOne(filter, updateDoc, options)
            console.log('updating', id)
            res.json(result)
        })
        //-------delete -------
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await usersCollection.deleteOne(query);
            console.log('delete hobe', id)
            res.json(result);
        })

    }
    finally {
        // await client.close();

    }
}

run().catch(console.dir)



// app.post('/users', (req, res) => {

//     console.log('hitting the post');
//     res.send('hit the post')
// })

app.get('/', (req, res) => {
    res.send('Running my crud server')
})

app.listen(port, () => {
    console.log('running server on port', port)
})
// const uri = "mongodb+srv://mydbuser1:L1WrNaGi2HDh5BM2@cluster0.1rrt8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//     const collection = client.db("foodmaster").collection("users");
//     // perform actions on the collection object
//     console.log('hitting')
//     const user = { user: 'haha', email: 'haha@gmail.com', phone: '01746848951' }
//     collection.insertOne(user)
//         .then(() => {
//             console.log('insert success');
//         })
//     // client.close();
// });



// const doc = {
        //     name: "Arekta new bro",
        //     email: 'newbro2.0@gmail.com',

        // }
        // const result = await usersCollection.insertOne(doc);
        //         console.log(`A document was inserted with the _id: ${result.insertedId}`);
        //         console.log(result);
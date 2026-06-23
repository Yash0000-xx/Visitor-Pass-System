const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || '*'
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/visitors', require('./routes/visitor'));
app.use('/api/appointments', require('./routes/appointment'));
app.use('/api/passes', require('./routes/pass'));
app.use('/api/checklog', require('./routes/checklog'));

app.get('/', (req, res) => {
    res.send("Backend server is up and running!");
});

let myPort = process.env.PORT || 5000;
let dbString = process.env.MONGO_URI;

mongoose.connect(dbString)
    .then(() => {
        console.log("Connected to the database!");
        app.listen(myPort, () => {
            console.log("Server listening on port " + myPort);
        });
    })
    .catch((err) => {
        console.log("Failed to connect to MongoDB");
        console.log(err);
    });
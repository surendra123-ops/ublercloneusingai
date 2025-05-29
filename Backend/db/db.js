const mongoose = require('mongoose');

function connectToDb() {
    mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('Connected to MongoDB'))
        .catch((err) => console.error('Failed to connect to MongoDB', err));
}


module.exports = connectToDb;
const mongoose = require('mongoose');
const { db_info } = require('./config');


const connectDb = () => {
    const { database_url } = db_info
    
    mongoose.connect(database_url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    db.once('open', () => {
      console.log('Connected to MongoDB');
    });
}

module.exports = { connectDb }
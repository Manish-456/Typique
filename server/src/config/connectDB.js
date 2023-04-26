const mongoose = require('mongoose');

const connectDB = async(uri) => {
    mongoose.set('strictQuery', true)
    try {
         await mongoose.connect(uri)
    } catch (error) {
      console.log(error)   
    }
 
}

module.exports = connectDB;
const mongoose  = require("mongoose");


async function connect_DB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('database connection smoothly..')
    } catch (error) {
        console.log('database connection faild..')
    }
};

module.exports = connect_DB
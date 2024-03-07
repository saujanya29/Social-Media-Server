const mongoose = require("mongoose");

module.exports = async() => {
    const mongoUrl = "mongodb+srv://saujanyashukla29092002:aRphiAHwd5mJplgI@cluster0.zcnktnx.mongodb.net/?retryWrites=true&w=majority"
      
    try {
        
        await mongoose.connect(mongoUrl)

        console.log("MongoDB Connected: " );
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}
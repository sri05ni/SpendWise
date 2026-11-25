const mongoose=require('mongoose')
const connectDB=async()=>{
    try{
        
        const conn = await mongoose.connect(process.env.MONGO_URL);
            // ,{useNewUrlParse:true,useUnifiedtopology:true}
        console.log(`DB is Connected: ${conn.connection.host}`)
         console.log(`Database: ${conn.connection.name}`);

    }catch(err){
        console.error("Error occured",err.message)
        process.exit(1)
    }
}

module.exports = connectDB;
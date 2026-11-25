const express=require('express')
const dotenv=require('dotenv')
const cors = require('cors');
const authroutes=require("./routes/authroutes")
const expensesroutes=require("./routes/expenseroutes")
const incomeroutes=require("./routes/incomeroutes")
const connectDB = require('./config/db');
dotenv.config()

const app=express()
app.use(cors());
app.use(express.json())
app.use("/api/auth", authroutes);
app.use("/api/expenses", expensesroutes);
app.use("/api/income",incomeroutes)
app.get("/",(req,res)=>{
    res.send("Api is running")
})
const PORT=process.env.PORT || 5000
app.listen(PORT,console.log("Server is running at port",PORT))

connectDB()
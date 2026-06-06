import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.config.js";

dotenv.config();
const PORT =process.env.PORT;

//connection to mongodb
connectDB()
    .then(() => {
        app.listen(PORT, '0.0.0.0',() => {
            console.log(`server is running at port :${process.env.PORT}`)
        })
    })
    .catch((err) => {
        console.log("Mongodb connection failed !!!", err);
    })
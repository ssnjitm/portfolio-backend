import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./config/db.config.js";

dotenv.config({
    path: "./.env"

})

// Only run seed in development or if explicitly requested
if (process.env.NODE_ENV === 'development' || process.env.SEED_ADMIN === 'true') {
    import ('./seed.js');
}

//connection to mongodb
connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`server is running at port :${process.env.PORT}`)
        })
    })
    .catch((err) => {
        console.log("Mongodb connection failed !!!", err);
    })
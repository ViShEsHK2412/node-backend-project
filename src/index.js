import dotenv from 'dotenv'
import connectDB from './db/index.js';

dotenv.config({
     path:'./.env'
})

console.log("MONGODB_URI from .env:", process.env.MONGODB_URI); 
   



connectDB()
.then(()=>{
    try {
            // Your app.on('error') is here, which might be a design choice,
            // but syntactically it's within the then block.
            app.on('error', (error) => {
                console.log('Error', error);
                throw error; // This throw will likely crash the process if uncaught higher up
            });

            // The 'app' object in app.listen doesn't directly return a promise
            // that this try/catch would capture for listen errors like EADDRINUSE.
            // For app.listen errors, you'd typically listen on the server instance.
            // However, sticking to the original structure for syntax correction:
            app.listen(process.env.PORT || 8000, () => {
                // Corrected console.log to show the actual port being used
                console.log(`server is running at port : ${process.env.PORT || 8000}`);
            });
        } catch (error) { // This catch block only catches synchronous errors within the try.
                          // It will NOT catch errors from app.listen (async) or app.on('error') (event-driven).
            console.log("Error inside then block's try-catch:", error);
        }
    })
    .catch((error) => { // This catch block correctly catches errors from connectDB()
        console.log("Error from connectDB() or its promise chain:", error);
    });





/*import express from "express"
const app = express()
( async ()=>{
    try{
       await mongoose.connect(`${process.env.MONGODB_URI}/${DB_Name}`)
       app.on("error",(error)=>{
        console.log("ERROR",error);
        throw error
       })

       app.listen(process.env.PORT,()=>{
        console.log(`App is listening on port ${process.env.PORT}`)
       })

    }catch(error){
        console.error("ERROR",error)
        throw err

    }
})()
*/

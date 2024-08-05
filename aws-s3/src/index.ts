import cookieParser from "cookie-parser";
import dotenv from "dotenv"
import express, { Request, Response } from 'express';
import cors from "cors"
import {rateLimit} from "express-rate-limit"

// Create an instance of the express application
const app = express();

// Set up environment variables from.env file
dotenv.config({
    path: ".env"  // Path to your environment variables file
})

// Middleware to handle CORS requests
app.use(cors({
    origin: ["http://localhost:5173", "*"],//process.env.CORS_ORIGIN
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}))

// Middleware to parse JSON request bodies

app.use(express.json());

// Middleware to parse URL-encoded request bodies (with querystring)
app.use(express.urlencoded({ extended: true , limit: "30kb" }));
// Middleware to parse cookies
app.use(cookieParser())


app.use(rateLimit(
    {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
        message: "Too many requests from this IP, please try again later after 15 mins."
    }
))




import {middleware} from "../src/middlewares/middleware"
import awsRoute from "../src/routes/aws-routes"
app.get('/', (req: Request, res: Response) => {
    res.status(200).send('Hello Now my application is working!');
});

app.use("/api/v1/aws", awsRoute)



app.use("/api",middleware.ErrorMiddleware)

app.use("*",(req, res)=>{
    res.status(404).json({message: "Page not found"})
})

// console.log(process.env.PORT)
app.listen(process.env.PORT || 9007, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})
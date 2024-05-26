import express from "express";
import initApiRoutes from "./routes/api";
import 'dotenv/config'
import bodyParser from "body-parser";
import path from 'path';
import sendNoti from "./util/sendNoti";

const app = express();
const PORT = process.env.PORT

// Add headers before the routes are defined
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    // res.setHeader('Access-Control-Allow-Origin', `https://life-clinic-fe.vercel.app`);
    res.setHeader('Access-Control-Allow-Origin', `http://localhost:3000`);
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/', express.static(path.join(__dirname, 'images')))

initApiRoutes(app);

app.listen(PORT, () => {
    console.log("Running: " + PORT);
})

sendNoti()
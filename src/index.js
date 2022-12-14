const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const port = process.env.PORT || 4000;
const connectDB = require('./configs/connectDB');
const routes = require('./routes');
const viewEngine = require('./configs/viewEngine');
const cookieParser  = require('cookie-parser');
dotenv.config();
const app = express();
app.use(express.json({extended: true, limit: '50mb'}));
app.use(express.urlencoded({ extended: true, limit: '50mb'}));
app.use(cors());
app.use(cookieParser());
app.use(helmet());
app.use(morgan("dev"));
viewEngine(app);
connectDB();
routes(app);
app.listen(port, () => console.log(`Server listening on port http://localhost:${port}`));
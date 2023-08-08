const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const router = require('./routes/router');
const app = express();

app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(router);

app.listen(process.env.PORT || 5000 , () => {
    console.log('starting server...');
});
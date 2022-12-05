
//init code
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const port = process.env.PORT;
const database = require('./db');
const userController = require('./controllers/user')




// middlewere setup
app.use(morgan('dev'));
app.use(cors());
app.use('/api/user', userController);

//defaults routes
app.all('/', (req, res)=>{
    // res.send("asdf")
    return res.json({
        status : true,
        message : 'Index Page working...'
    })
})



// start server
app.listen(port, ()=> {
    console.log("Server Successfully Staring at " + port);
});


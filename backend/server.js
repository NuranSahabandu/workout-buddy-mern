require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const workoutRoutes = require('./routes/workouts')
const userRoutes = require('./routes/user')
const cors = require('cors')


// express app
const app = express()

// middleware
app.use(express.json())

// cors configuration


app.use(cors({
  origin: "https://workout-buddy-mern-six.vercel.app",
  credentials: true
}));


app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})


/*
// routes
app.get('/', (req, res) => {
    res.json({mssg: 'Welcome to the app'})
})
*/

// routes
app.use('/api/workouts', workoutRoutes) 
app.use('/api/user', userRoutes) 

// connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
    // listen for requests
    app.listen(process.env.PORT, () => {
        console.log('connected to db & listening on port', process.env.PORT)
    });
    })
    .catch((error) => {
        console.log(error)
    })





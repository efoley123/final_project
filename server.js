require('dotenv').config() //for local development
const mongoose = require('mongoose')
const Goal = require('./goalSchema.js')
const User = require('./userSchema.js')

const http = require('http'),
      fs   = require('fs'),
      port = 3000,
      uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@webwarefinalproject.3szqw.mongodb.net`

mongoose.connect(uri)

async function testDatabase() {
  let user = await User.exists({ username: "Lauratest3" })
  if (user == null) {
    user = await User.create ({
      username: "Lauratest3",
      password: "password",
      goals: [],
      points: 0,
      leaderboardNumber: null
    })
  }
  
  const goal = await Goal.create ({
    author: user._id,
    title: "GOAL",
    description: "fdsfdsfdsf",
    dueDate: "2024-10-04",
    priority: "low",
    complete: false,
    active: false
  })

  await User.findOneAndUpdate( { _id: user._id}, { $push: {goals: goal._id}})
}
testDatabase();



const server = http.createServer( function( request,response ) {
  switch( request.url ) {
    case '/':
      sendFile( response, 'public/index.html' )
      break
    case '/calendar.css':
      sendFile( response, 'public/calendar.css' )
      break
    case '/calendar.js':
        sendFile( response, 'public/calendar.js' )
        break
    case '/signup.html':
      sendFile( response, 'public/signup.html' )
      break
    case '/style.css':
      sendFile( response, 'public/style.css' )
      break
    case '/createAccount': //will change this when database is avaliable
        sendFile( response, 'public/signup.html' )
        break
    case '/login'://will change this when database is avaliable
            sendFile( response, 'public/index.html' )
            break
    default:
      response.end( '404 Error: File Not Found' )
  }
})

server.listen( process.env.PORT || port )

const sendFile = function( response, filename ) {
   fs.readFile( filename, function( err, content ) {
     response.end( content, 'utf-8' )
   })
}

app.use( (req,res,next) => {
  if( collectionJD !== null ) {
    next()
  }else{
    res.status( 503 ).send()
  }
})

 // route to get all docs
 app.get('/docs', async (req, res) => {
  console.log("CollectionJD:", collectionJD);
  if (collectionJD !== null) {
    const docs = await collectionJD.find({}).toArray()
    res.json( docs )
    console.log(docs)
  }
})

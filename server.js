require('dotenv').config(); //for local development
const mongoose = require('mongoose')
const Goal = require('./goalSchema.js')
const User = require('./userSchema.js')

const http = require('http'),
      fs   = require('fs'),
      port = 3000,
      uri = `mongodb+srv://${process.env.MYUSER}:${process.env.PASS}@webwarefinalproject.3szqw.mongodb.net`



mongoose.connect(uri)

async function testDatabase() {
  let user = await User.exists({ username: "Lauratest3" })
  if (user == null) {
    const user = await User.create ({
      username: "Lauratest4",
      password: "password",
    })
  }
  
  const goal = await Goal.create ({
    author: user._id,
    title: "GOAL",
    description: "fdsfdsfdsf",
    days: ["2024-10-04", "2024-10-05"],
    priority: "low"
  })

  await User.findOneAndUpdate( { _id: user._id}, { $push: {goals: goal._id}})
}
testDatabase();



const server = http.createServer( function( request,response ) {
  switch( request.url ) {
    case '/':
      sendFile( response, 'public/login.html' )
      break
    case '/index.html':
      sendFile( response, 'public/login.html' )
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

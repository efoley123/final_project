require('dotenv').config(); //for local development
const mongoose = require('mongoose')
const Goal = require('./goalSchema.js')
const User = require('./userSchema.js')


const express = require("express"),
     { MongoClient, ObjectId } = require("mongodb"),//objectID allows us to make a key and access things
     app = express()



const http = require('http'),
     fs   = require('fs'),
     port = 3000,
     uri = `mongodb+srv://${process.env.MYUSER}:${process.env.PASS}@webwarefinalproject.3szqw.mongodb.net`


const client = new MongoClient( uri )
const db = client.db("test")
let userCollection = null
let goalsCollection = null
let collection = null


mongoose.connect(uri)


app.use(express.static("public") )//folder public
app.use(express.json() )


const cookie  = require( 'cookie-session' ),
hbs     = require( 'express-handlebars' ).engine


app.get('/', (req, res) => {
  res.redirect('login.html'); // Redirect to login.html when accessing the root URL
});



async function run() {
 await client.connect() //wait for client to connect...
 //if (collectionName!==null) {collection = await client.db("database").collection(collectionName)}
  //my database here collecction variable
  collection = await client.db("test").collection("namey") //default cause otherwise get 503 error  in app.use
  userCollection = await client.db("test").collection("users")
  goalsCollection = await client.db("test").collection("goals")




// route to get all docs
app.get("/docs", async (req, res) => {
 if (collection !== null) {//this returns the whole thing
   const docs = await collection.find({}).toArray()// find allows you to pass something in, if blank returns everything inside collection and return results as array
   res.json( docs )
 }
})
}


app.use( (req,res,next) => {
 if( collection !== null ) {
   next()
 }else{
   res.status( 503 ).send()
 }
})


// use express.urlencoded to get data sent by defaut form actions
// or GET requests
app.use( express.urlencoded({ extended:true }) )





//not referencing this at all cause I commented it out
// async function testDatabase() {
//  let user = await User.exists({ username: "Lauratest3" })
//  if (user == null) {
//    user = await User.create ({
//      username: "Lauratest3",
//      password: "password",
//      goals: [],
//      points: 0,
//      leaderboardNumber: null
//    })
//  }
//   const goal = await Goal.create ({
//    author: user._id,
//    title: "GOAL",
//    description: "fdsfdsfdsf",
//    dueDate: "2024-10-04",
//    priority: "low",
//    complete: false,
//    active: false
//  })


//  await User.findOneAndUpdate( { _id: user._id}, { $push: {goals: goal._id}})
// }
//testDatabase();

app.engine( 'handlebars',  hbs() )
app.set(    'view engine', 'handlebars' )
app.set(    'views',       './views' )



// cookie middleware! The keys are used for encryption and should be
// changed
app.use( cookie({
 name: 'session',
 keys: ['access1', 'access2'] //previously were key1 and key2
}))


app.post( '/createAccount', (req,res)=> {
 res.redirect( 'signup.html' )
})

app.get('/goals', async (req, res) => {
  
  if (!req.session.login) {
    return res.status(401).send('Unauthorized');
  }

  const userId = req.session.userId;
  const goals = await goalsCollection.find({ author: ObjectId(userId) }).toArray();

  res.json(goals);
});

app.post( '/newAccount', async (req,res)=> {

  console.log(req.body);

  if (req.body.password!=="" && req.body.username!=="" && req.body.password===req.body.retypePassword) {


      const docs = await userCollection.find({}).toArray()
      let add = 1;
      for (i=0;i<docs.length;i++) {
          if (req.body.username===docs[i].username) {
              add = 0;
          }
      }
      if (add===1) {
        newData = {
          username: req.body.username,
          password: req.body.password,
          goals: [],
          points: 0,
          leaderboardNumber: null,
          __v: 0,
        }
          const result = await userCollection.insertOne(newData)
          res.render('login', { msg:'successfully created account, now log in', table:docs, layout:false })
      }
      else {
          res.render('signup', { msg:'username matches a user already in the system', layout:false })
      }
  } else if (req.body.username==="") {
    res.render('signup', { msg:'username is required', layout:false })
  } else if (req.body.password==="") {
    res.render('signup', { msg:'password is required', layout:false })
  } else if (req.body.password!==req.body.retypePassword) {
    res.render('signup', { msg:'the passwords are different', layout:false })
  } else {
      res.render('signup', { msg:'could not create account', layout:false })
  }
  
})


app.post( '/logout', (req,res)=> {
  res.redirect( 'login.html' )
  //would also rechange a global variable if we start saving a global variable which knows what user is logged in
 })

app.post( '/login', async (req,res)=> {


 console.log( req.body )


 const docs = await userCollection.find({}).toArray()
 let loginSuccessful = 0;
 for (i=0;i<docs.length;i++) {
     if (req.body.password ===docs[i].password && req.body.username ===docs[i].username) {
         loginSuccessful = 1;
         console.log(req.body.username)
         collectionName = req.body.username;
         collection = await client.db("users").collection(req.body.username);
     }
 }


if(loginSuccessful) {
 req.session.login = true
 res.redirect( 'main.html' )
}else{
 // cancel session login in case it was previously set to true
 req.session.login = false
 // password incorrect, send back to login page
 res.render('login', { msg:'login failed, please try again', layout:false })
}
})

app.get( '/', (req,res) => { //
  res.redirect( 'login.html' )
  //res.render( 'login', { msg:'', layout:false })
})

app.post( '/home', (req,res)=> {
  res.redirect( 'main.html' )
  //would also rechange a global variable if we start saving a global variable which knows what user is logged in
 })

app.post( '/leaderboard', (req,res)=> {
  res.redirect( 'leaderboard.html' )
  //would also rechange a global variable if we start saving a global variable which knows what user is logged in
 })

 app.post( '/goals', (req,res)=> {
  res.redirect( 'goals.html' )
  //would also rechange a global variable if we start saving a global variable which knows what user is logged in
 })

// route to get all docs
app.get("/lbdisplay", async (req, res) => {
  if (userCollection !== null) {//this returns the whole thing
    const docs = await userCollection.find({}).toArray()// find allows you to pass something in, if blank returns everything inside collection and return results as array
    //now I need to see which ones have the most points max is 10
    let arrayPoints = [];
    let arrayUsername = [];
    let top10 = [];

    for (let i=0;i<docs.length;i++) {
      //row
      let rowPoints = docs[i].points;
      let rowUser = docs[i].username;
      arrayPoints.push(rowPoints); //this will push all of the points in the user
      arrayUsername.push(rowUser);
    }
    //get the top 10
    let max = 10;
    if (docs.length>10) {
      max = docs.length;
    }
    for (let i =0;i<max;i++) {
      let highest = -1;
      let index = 0;
      for (let j =0;j<arrayPoints.length;j++) {
        if (highest>arrayPoints[j]) {
          highest = arrayPoints[j];
          index = j;
        }
      }
      let top10account = {
        username:arrayUsername[index],
        points:arrayPoints[index],
      }
      top10.push(top10account);
      arrayPoints.splice(index, 1);
      arrayUsername.splice(index, 1);
      }
    console.log(top10);
    console.log(JSON.stringify(top10))
    res.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
      res.end(JSON.stringify(top10))
  }
})



run()

app.listen( process.env.PORT || port )
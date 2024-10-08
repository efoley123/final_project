require('dotenv').config(); //for local development
const mongoose = require('mongoose')
const Goal = require('./goalSchema.js')
const User = require('./userSchema.js')
let currUser = null
let id = null

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
let collection = null
let goalsCollection = null;


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
  goalsCollection = await client.db("test").collection("goals");





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

app.post( '/calendar', (req,res)=> {
  res.redirect( 'calendar.html' )
 })

app.post( '/goals', (req,res)=> {
  res.redirect( 'goals.html' )
  //would also rechange a global variable if we start saving a global variable which knows what user is logged in
 })


//getting all goals
app.get('/goals', async (req, res) => {
  
  if (!req.session.login) {
    return res.status(401).send('Unauthorized');
  }

  const userId = req.session.userId;
  const goals = await goalsCollection.find({ author: ObjectId(userId) }).toArray();

  res.json(goals);
});

app.post( '/newAccount', async (req,res)=> {

  // console.log(req.body);

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
  currUser = null;
  id = null
  res.redirect( 'login.html' )
  //would also rechange a global variable if we start saving a global variable which knows what user is logged in
 })

app.post( '/login', async (req,res)=> {


//  console.log( req.body )


 const docs = await userCollection.find({}).toArray()
 let loginSuccessful = 0;
 let userId = null
 for (i=0;i<docs.length;i++) {
     if (req.body.password ===docs[i].password && req.body.username ===docs[i].username) {
         loginSuccessful = 1;
         userId = docs[i]._id;
         console.log(req.body.username)
         collectionName = req.body.username;
         collection = await client.db("users").collection(req.body.username);
     }
 }


if(loginSuccessful) {
  currUser = req.body.username;//setting the global variables correctly
  id = userId;

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

app.post( '/mypetpage', (req,res)=> {
  res.redirect( 'mypet.html' )
  })


app.post( '/leaderboard', (req,res)=> {
  res.redirect( 'leaderboard.html' )
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
        if (arrayPoints[j]>highest) {
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

app.post("/getCurrectGoalsForToday", async (req, res) => {
  //
  const goalsCollection = await client.db("test").collection("goals");
  const account = await goalsCollection.find({author: id}).toArray();

  if (account.length > 0) {
    let arrayOfGoals = [];
    let newData;
    console.log("account is greater than 0");
    for (i=0;i<account.length;i++) {
      if (account[i].days.includes(req.body.weekdayName)) {
        newData = {
          _id: account[i]._id,
          title: account[i].title,
        }
        arrayOfGoals.push(newData);
      }
    }
    res.json(arrayOfGoals)
  }
})

app.post( '/complete', async (req,res)=> {
  //will have to change in goals that it is complete now
  console.log("We completed 1 of the goals")
  let correctAdd = 1;
  const goals = req.body;
  const keys = Object.keys(goals);
  console.log("here is keys")
  console.log(keys);
  console.log(keys.length);
  if (keys.length != 0) {
    const goalsCollection = await client.db("test").collection("goals");
    
    
    for (i=0; i<keys.length;i++) {
      //console.log(goals[i]);
      let addCurrentGoal = 1;
      let account = await userCollection.find({_id: id}).toArray();
      let goal = await goalsCollection.find({_id:  new ObjectId( goals[keys[i]])}).toArray();


      

      console.log("here is goal \n");
      console.log(goal[0])
      let array = goal[0].completed;
      console.log("here is array \n");
      console.log(array);
      let date = new Date();
      console.log("here is date " + date + "\n");
      
      for (j=0;j<array.length;j++) {
        if (array[j]===date.toDateString()) {
          //we do not want to add it and give points
          correctAdd=0;
          addCurrentGoal = 0;
  
        }
      }
      if (addCurrentGoal===1) {
      array.push(date.toDateString());
      console.log(array);

      let result = await goalsCollection.updateOne(
         { _id: new ObjectId( goals[keys[i]] ) },
         { $set:{ completed:array } })

         console.log(account);
         console.log( account[0].points);

         let totalPoints = account[0].points+ 10;
         let result2 = await userCollection.updateOne(
           { _id: new ObjectId( id ) },
           { $set:{ points:totalPoints} })
         
    }
  }

    if (correctAdd===0) {

      res.render('main', { msg:'you tried to complete a goal you already completed so we did not double count it', layout:false })
    } else if (correctAdd===1) {
    console.log("updated individual goal");
    //I can then do a handlebars to say goal is now completed    
    res.render('main', { msg:'successfully completed a goal', layout:false })
    }
  }
  else {
    res.render('main', { msg:'you did not select a goal to complete', layout:false })
  }
  })

  app.get('/getUserPoints', async (req, res) => {

    let account = await userCollection.find({_id: id}).toArray();
    console.log("get user account for points")
    console.log(account);
    console.log(account[0].points);
    res.json( account[0].points)


  })



app.post( '/home', (req,res)=> {
  res.redirect( 'main.html' )
  //would also rechange a global variable if we start saving a global variable which knows what user is logged in
 })

app.post( '/mypetpage', (req,res)=> {
  res.redirect( 'mypet.html' )
  })


app.post( '/leaderboard', (req,res)=> {
  res.redirect( 'leaderboard.html' )
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
        if (arrayPoints[j]>highest) {
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

app.post("/getCurrectGoalsForToday", async (req, res) => {
  //
  const goalsCollection = await client.db("test").collection("goals");
  const account = await goalsCollection.find({author: id}).toArray();

  if (account.length > 0) {
    let arrayOfGoals = [];
    let newData;
    console.log("account is greater than 0");
    for (i=0;i<account.length;i++) {
      if (account[i].days.includes(req.body.weekdayName)) {
        newData = {
          _id: account[i]._id,
          title: account[i].title,
        }
        arrayOfGoals.push(newData);
      }
    }
    res.json(arrayOfGoals)
  }
})

app.post( '/complete', async (req,res)=> {
  //will have to change in goals that it is complete now
  console.log("We completed 1 of the goals")
  let correctAdd = 1;
  const goals = req.body;
  const keys = Object.keys(goals);
  console.log("here is keys")
  console.log(keys);
  console.log(keys.length);
  if (keys.length != 0) {
    const goalsCollection = await client.db("test").collection("goals");
    
    
    for (i=0; i<keys.length;i++) {
      //console.log(goals[i]);
      let addCurrentGoal = 1;
      let account = await userCollection.find({_id: id}).toArray();
      let goal = await goalsCollection.find({_id:  new ObjectId( goals[keys[i]])}).toArray();


      

      console.log("here is goal \n");
      console.log(goal[0])
      let array = goal[0].completed;
      console.log("here is array \n");
      console.log(array);
      let date = new Date();
      console.log("here is date " + date + "\n");
      
      for (j=0;j<array.length;j++) {
        if (array[j]===date.toDateString()) {
          //we do not want to add it and give points
          correctAdd=0;
          addCurrentGoal = 0;
  
        }
      }
      if (addCurrentGoal===1) {
      array.push(date.toDateString());
      console.log(array);

      let result = await goalsCollection.updateOne(
         { _id: new ObjectId( goals[keys[i]] ) },
         { $set:{ completed:array } })

         console.log(account);
         console.log( account[0].points);

         let totalPoints = account[0].points+ 10;
         let result2 = await userCollection.updateOne(
           { _id: new ObjectId( id ) },
           { $set:{ points:totalPoints} })
         
    }
  }

    if (correctAdd===0) {

      res.render('main', { msg:'you tried to complete a goal you already completed so we did not double count it', layout:false })
    } else if (correctAdd===1) {
    console.log("updated individual goal");
    //I can then do a handlebars to say goal is now completed    
    res.render('main', { msg:'successfully completed a goal', layout:false })
    }
  }
  else {
    res.render('main', { msg:'you did not select a goal to complete', layout:false })
  }
  })

  app.get('/getUserPoints', async (req, res) => {

    let account = await userCollection.find({_id: id}).toArray();
    console.log("get user account for points")
    console.log(account);
    console.log(account[0].points);
    res.json( account[0].points)


  })



app.get('/goalsLoad', async (req, res) => {
  const goalsCollection = await client.db("test").collection("goals");
  const account = await goalsCollection.find({author: id}).toArray();
  if (account.length > 0) {
    const titles = account.map(goal => goal.title);
    const days = account.map(goal => goal.days);
    const id = account.map(goal => goal._id);
    res.json(
      {
        titles: titles,
        days: days,
        _id: id
      }); 
// } else {
//     res.json([[], []]); // Return empty arrays if no account is found
// }
    }
})


app.get('/allGoals', async (req, res) => {
  const everyoneGoalsCollection = await client.db("test").collection("goals");
  const currentAccountGoals = await everyoneGoalsCollection.find({author: id}).toArray();
  if (currentAccountGoals.length > 0) {
    //const titles = currentAccountGoals.map(goal => goal.title); 
    //console.log(titles)
    res.json(currentAccountGoals); 
  } else {
    res.json([]); 
  }
})

app.get('/getGoal/:id', async (req, res) => {
  const goalId = req.params.id; // Get the goal ID from the URL

  const everyoneGoalsCollection = await client.db("test").collection("goals");
  // Find the goal by its ID
  const goal = await everyoneGoalsCollection.findOne({ _id: new ObjectId(goalId) });

  if (goal) {
      res.json(goal); // Return the goal as JSON
  } else {
      res.status(404).send('Goal not found'); // Handle case where goal does not exist
  }
  
});

app.put('/updateGoal/:id', async (req, res) => {
  const goalId = req.params.id; // Get the goal ID from the URL
  const updatedData = req.body; // Get the updated goal data from the request body


  const result = await goalsCollection.updateOne(
      { _id: new ObjectId(goalId) }, // Find the goal by ID
      { $set: updatedData } // Update the fields provided in the body
  );

  if (result.modifiedCount === 1) {
      // If the goal was successfully updated
      const allGoals = await goalsCollection.find({ author: id }).toArray(); // Fetch all goals for the user
      res.status(200).json(allGoals); // Respond with all goals
  } else {
      res.status(404).send('Goal not found or no changes made'); // Handle case where goal is not found
  }
  
});



app.delete('/deleteGoal/:id', async (req, res) => {
  const goalId = req.params.id;

  const everyoneGoalsCollection = await client.db("test").collection("goals");
      
  const result = await everyoneGoalsCollection.deleteOne({ _id: new ObjectId(goalId) });

  const currentAccountGoals = await everyoneGoalsCollection.find({author: id}).toArray();
  if (currentAccountGoals.length > 0) {
    res.json(currentAccountGoals); 
  } else {
    res.json([]); 
  }
  
});


app.post('/addGoal', async(req, res) =>{
  const newGoal = req.body;

  newGoalData = {
    author: id,
    title: newGoal.title,
    description: newGoal.description,
    days: newGoal.days,
    completed: []
  }

  const everyoneGoalsCollection = await client.db("test").collection("goals");
  const result = await everyoneGoalsCollection.insertOne(newGoalData)

  
  const currentAccountGoals = await everyoneGoalsCollection.find({author: id}).toArray();
  if (currentAccountGoals.length > 0) {
    res.json(currentAccountGoals); 
  } else {
    res.json([]); 
  }


})

app.get("/getUserID", async (req, res) => {
  res.json(id); // Return the id as JSON
})


app.get("/determineCat", async (req, res) => {
  const goalsCollection = await client.db("test").collection("goals");
  const authorsGoals = await goalsCollection.find({author: id}).toArray();
  let numGoals = 0 
  let numCompletedGoals = 0
  const currentDate = new Date();// Outputs "Mon Aug 31 2020"
  const weekdayNumber = currentDate.getDay();
  const weekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday",];
  const day = weekdays[weekdayNumber]
  for (const goal of authorsGoals) {
    if (goal.days.includes(day)) {
      numGoals++
      if (goal.completed.includes(currentDate.toDateString())) {
        numCompletedGoals++
      }
    }
  }

  numberToReturn = null
  if (numCompletedGoals == 0) {
    numberToReturn = 0 //sad cat
  } else if (numCompletedGoals > 0 && numCompletedGoals < numGoals) {
    numberToReturn = 1 //normal cat
  } else if (numCompletedGoals == numGoals){
    numberToReturn = 2 //happy cat
  }

  res.json(numberToReturn)

  
  //get goals from User goals list
  // numGoals = goals.length
  // numCompletedGoals = 0
  // for each goal in goals
  //     if (goal.days contains day) {
  //         if(goal.completed contains currentDate) {
  //             numCompletedGoals++
  //         }
  //     }
}) 


app.post('/checkedGoals', async (req, res) => 
{
  const goals = req.body.goals;
  const ids = req.body.goalIds;
  const date = req.body.date;

  // console.log("test--------------------------");
  // console.log("id", ids)
  let i = 0
  for (const goal of goals) {
    const dbGoal = await goalsCollection.find({_id: new ObjectId(ids[i])}).toArray();
    // console.log(res);
    // console.log("-------")

    // console.log(dbGoal)
    let completedSection = dbGoal.completed
    // if(!completedSection.includes(date)){
    const res = await goalsCollection.updateOne({ _id: new ObjectId(ids[i]), completed: { $ne: date } }, {
      $addToSet: {
        completed: [date]
      }

      //if this then add 10 points to another thing
    });
    if(res.modifiedCount>0)
    {
      const usersCollection = await client.db("test").collection("users");
      const account = await goalsCollection.findOne({author: id});
      await usersCollection.updateOne(
        { _id: new ObjectId(id) },
        { $inc: { points: (account.points || 0) + 10 } }
      );
    }


    i++
  }
  res.status(200)
  

  
  //console.log(goals)

})



run()

app.listen( process.env.PORT || port )
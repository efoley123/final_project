# Final Project
By Eleanor Foley, Laura Pellowski, Ashley Jacob, Sophia John, Kayla Lem

## Description
LINK: 

Our project is a habit tracker website. The user can create an account, and then add habits that they would like to complete. For example, if they want to have a habit of "Drinking water", create a new goal titled "Drinking water", add a description if they would like, and then select the days of the week in which they want to complete that goal. We then generate a "priority" marking for that goal [FIX, not sure exactly how this is working]. The home page will show the habits assigned for that day. For example, if today is Monday, only the habits assigned to be completed on Mondays will show up. If the user wants a more general overview of all their habits, they can navigate over to the calander page [FIX, elaborate more, not sure what features it has]. When the user completes a task, they will get a point added to their account's score. There is a leaderboard page which displays every user's score. The idea behind this is to help motivate the users to complete their goals, so that they can increase their score on the leaderboard. In addition, another motivating factor for the user is the pet page. This is where they can take care of a cute pet cat. If they don't complete any of their tasks for the day, the cat is sad. If they complete some of their goals, the cat is normal with a heart. And if they complete all of their goals, the cat is very happy.

The theme of the website is supposed to be cute and comforting. Because of this, we chose a pastel color palette. [FIX, can expand more here potentially]


## Additional Instructions

## Technologies Used
Node.js:

Express: We used express for our server.

Cookies/Handlebars:

Mongoose/MongoDB: We wanted to enforce a schema on our database, since we all favor this way of designing databases versus just using normal MongoDB. Mongoose was easy to install, and writing the schemas were pretty easy. There are two schemas: Users and Goals. Users keeps track of the username and password of each user, as well was which goals they have, their score, and their leaderboard number. Goals knows the author of the goal, the title, description, priority, and days of that goal, as well as what days of the week that goal was completed.

## Challenges
The original plan was to use a different database tool, but we had trouble getting the connection set up. Since MongoDB worked well in the individual assignments in terms of connecting to the database, we decided to try using Mongoose since we wanted an enforced schema. This was our first time using Mongoose, so there was a little bit of a learning curve, but once one scema was done and objects were able to be added to the database, the second one went smoothly

One of us had issues with getting the database connection string to communicate with the .env file, which took a while to troubleshoot and sort out.

## Responsibilities
Eleanor: Login page, Leaderboard page

Sophia: Calendar page

Ashley: Home page?

Kayla: Conceptually making DB schema, drawings for pet cat, CSS styling for home page and sidebar navigation in home page

Laura: Helped Kayla with conceptual DB schema, then implemented database with Mongoose. Also wrote first draft of the README.

## Link to Video
VIDEO LINK:

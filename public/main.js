function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
  document.getElementById("main").style.marginLeft = "250px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("main").style.marginLeft = "0";
  }
  
const date = async function( event ) {
    const currentDate = new Date().toDateString();// Outputs "Mon Aug 31 2020"
    console.log(currentDate);
    //textContent
    DateForToday.textContent = currentDate;
}

const userPoints = async function( event ) {

    const textpoints = document.getElementById('points');


    const response = await fetch( '/getUserPoints', {
        method:'GET' //POST is 
      })

      const text = await response.json();

      textpoints.textContent= "EXP: "+ text;


}

const goalsToday = async function( event ) {

    //will query for the goals of the current day
    //date should be defined already
    // have to see what the professor did before with his code

    const currentDate = new Date();// Outputs "Mon Aug 31 2020"
    const weekdayNumber = currentDate.getDay();
    const weekdays = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];

    const input = weekdays[weekdayNumber],
          json = { "weekdayName": input},
          body = JSON.stringify( json )

    const response = await fetch( '/getCurrectGoalsForToday', {
        method:'POST', //POST is 
        headers: {
          'Content-Type': 'application/json'
        },
        body
      })
      const text = await response.json()
      let count = 0;
      const form = document.getElementById('formGoal');
      for (i=0;i<text.length;i++) {
        console.log("in the for loop in the js")
        count++;
        let str = "goal" + String(count);
        let newInput = document.createElement('input');
        newInput.type = 'checkbox';
        newInput.name = str;
        let str2 = text[i]._id;
        newInput.value = str2;
        newInput.style = "margin:7px; align-items: start;"

        let newLabel = document.createElement('label');
        newLabel.htmlFor = str;
        newLabel.id = str;
        newLabel.textContent = text[i].title;
        newLabel.style = "";

        let newBR = document.createElement('br');

        //appending to form
        form.appendChild(newInput);
        form.appendChild(newLabel);
        form.appendChild(newBR);
      }
      if (count>0) {
        
        let newInput = document.createElement('input');
        newInput.type = 'submit';
        newInput.value = "Completed A Goal";
        newInput.style = "margin:7px; background-color:  #ffbee5; border-radius: 15px; color: black; padding: 10px 20px; text-align: center; vertical-align: middle; text-decoration: none; display: inline-block; font-size: 14px; margin: 10px 4px; cursor: pointer;";
        form.appendChild(newInput);
      }
      //<input type="checkbox" id="goal1" name="goal1" value="goal1complete">
     // <label for="goal1" id = "goal1"> drink wattter</label><br>
      //<input type="checkbox" id="goal2" name="goal2" value="goal2complete">
      //<label for="goal2">live</label><br><br></br>
      //append the goals returned to something on the screen
      //<input type="submit" value="Submit">

}

const someGoalCompleted = async function( event ) {
}




window.onload = function() {
    date();

    

    const DateForToday = document.getElementById('DateForToday');

    goalsToday();
    userPoints();
    console.log("ran this above");

}
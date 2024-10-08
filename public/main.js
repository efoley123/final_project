
const date = async function( event ) {
    const currentDate = new Date().toDateString();// Outputs "Mon Aug 31 2020"
    console.log(currentDate);
    //textContent
    DateForToday.textContent = currentDate;
}

const goalsToday = async function( event ) {

    //will query for the goals of the current day
    //date should be defined already
    // have to see what the professor did before with his code

}




window.onload = function() {
    date();

    const DateForToday = document.getElementById('DateForToday');

    goalsToday();
    console.log("ran this above");


    const tableBody = document.getElementById('tableBody');

}
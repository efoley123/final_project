


const date = async function( event ) {
    const currentDate = new Date().toDateString();// Outputs "Mon Aug 31 2020"

    console.log(currentDate);
    //textContent

    DateForToday.textContent = currentDate;

}


window.onload = function() {
    date();

    const DateForToday = document.getElementById('DateForToday');

}
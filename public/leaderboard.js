const display = async function( event ) {
    // stop form submission from trying to load
    // a new .html page for displaying results...
    // this was the original browser behavior and still
    // remains to this day
    //event.preventDefault()

    const response = await fetch( '/lbdisplay', {
      method:'GET'
    })
    if (response.status==200) {//request successful

    } else if (response.status==400) {
      //no data to display
    }
    const text = await response.json()

    
    //element.innerHTML = `<a href="http://wpi.edu"> ${text[2].title} </a>`
    while (tableBody.rows.length > 0) {
      tableBody.deleteRow(0);//clearing the table rows to rewrite
    }
    for (let i=0;i<text.length;i++) {
      // Create a new row
      let row = document.createElement('tr');

      for (const key in text[i]) {
        if (key!=="_id") {
        let cell = document.createElement('td');
        cell.textContent = text[i][key]; // Set the content of the cell
        row.appendChild(cell);
      }
      }
      tableBody.appendChild(row);
    }
      
      

  
    console.log('text:',"display clicked");

  }


window.onload = function() {
    display();
    console.log("ran this above");

    const leaderboardButton = document.querySelector("#leaderboardButton");
    leaderboardButton.onclick = display;

    const tableBody = document.getElementById('tableBody');
}
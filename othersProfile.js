//https://mainserver.gamedev46.repl.co/api/users

const displayArea = document.getElementById('display-column');

document.getElementById('profile-title').innerText = sessionStorage.getItem('profile-visiting') + "'s Profile";

// Take the user back to the main home page when they click the logo

document.getElementById('nav-image-link').addEventListener('click', e => {
  window.location.href = "index.html";
})

// Function to locate and request the current messages from the server

function getJsonFromServerFiles() {
  fetch('https://mainserver.gamedev46.repl.co/api/users')
  .then(res => {
    return res.json();
  })
  .then(data => {
    decodeAndDisplayDataFromServer(data);

    getDataAboutUsers();
  })
}

function getDataAboutUsers() {
  fetch('https://mainserver.gamedev46.repl.co/api/logins')
  .then(res => {
    return res.json();
  })
  .then(data => {
    decodeVerifiedDataFromServer(data);
  })
}

function decodeVerifiedDataFromServer(verifiedData) {
  var dataArray = verifiedData.data;

  var decodedMessage = String.fromCharCode(...dataArray);

  var seperatedText = decodedMessage.split("||");
  seperatedText.pop();

  for (var x = 0; x < 5000; x++) {
    var elementsID = x * 2;

    var item = document.getElementById(elementsID);

    if (item == null) {
      continue;
    }

    for (var y = 0; y < seperatedText.length; y += 3) {

      if (seperatedText[y + 2] == "verified" && item.innerText == seperatedText[y]) {
        item.innerHTML = item.innerHTML + ' <i class="fas fa-check-square" title="Verified"></i>'; 
      }
      else if (seperatedText[y + 2] == "admin" && item.innerText == seperatedText[y]) {
        item.innerHTML = item.innerHTML + ' <i class="fas fa-crown" title="Admin"></i>';
      }

    }
  } 
}

getJsonFromServerFiles();

/* Takes the char codes from the server request 
and splits them into a string array ready for 
use on theweb page*/

function decodeAndDisplayDataFromServer(dataFromServer, verifiedOrNot) {
  var dataArray = dataFromServer.data;

  var decodedMessage = String.fromCharCode(...dataArray);
  console.log("Decoded message: " + decodedMessage);

  var seperatedText = decodedMessage.split("||");
  seperatedText.pop();

  console.log(seperatedText);

  // Create all the text fields for the chat

  for(var z = 0; z < seperatedText.length; z += 2) {
    var i = seperatedText.length - z - 2;

    if (sessionStorage.getItem('profile-visiting') != seperatedText[i]) {
      continue;
    }

    var chatElement = document.createElement('div');
    chatElement.classList.add('chatbox');

    if (i % 4) {
      chatElement.classList.add('chatbox-grey');
    }

    var usernameElement = document.createElement('h2');
    usernameElement.innerText = seperatedText[i];
    usernameElement.id = z;

    var atElement = document.createElement('a');
    atElement.appendChild(usernameElement);
    atElement.href = "otherUsersProfile.html";
    atElement.id = seperatedText[i];
    atElement.addEventListener('click', e => {
      var currentItem = e.target;
      sessionStorage.setItem('profile-visiting', currentItem.parentElement.id);
    });

    var usernameAtElement = document.createElement('h3');
    usernameAtElement.innerText = "@" + seperatedText[i];

    var userSpeech = document.createElement('p');

    var itemForLoop = seperatedText[i + 1];
    var outputtedStringFromLoop = "";
    var hasfoundmention = 0;

    for (var y = 0; y < itemForLoop.length; y++) {

      if (itemForLoop.substring(y, y + 1) == "@") {
        hasfoundmention = 1;
      }

      if (itemForLoop.substring(y, y + 1) == " " || itemForLoop.substring(y, y + 1) == "" || itemForLoop.substring(y, y + 1) == null) {
        hasfoundmention = 0;
      }

      if (hasfoundmention == 1) {
        outputtedStringFromLoop = outputtedStringFromLoop + itemForLoop.substring(y, y + 1).fontcolor('#006FFF');
      }
      else {
        outputtedStringFromLoop = outputtedStringFromLoop + itemForLoop.substring(y, y + 1);
      }

    }

    userSpeech.innerHTML = outputtedStringFromLoop;

    chatElement.appendChild(atElement);
    chatElement.appendChild(usernameAtElement);
    chatElement.appendChild(userSpeech);

    displayArea.appendChild(chatElement);

    var spacing = document.createElement('div');
    spacing.classList.add('spacing');

    displayArea.appendChild(spacing);
  }

  getDataAboutUsers();
}
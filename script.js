//https://mainserver.gamedev46.repl.co/api/users

const displayArea = document.getElementById('display-column');

var refreshAmountDisplay = 50;

var repeatTimesForLoop;

var scrollAmount = 0;

var canPressButton = 0;
var savedSeperatedText;
var buttonClickedArray = [];

for (var r = 0; r < 10000; r++) {
  buttonClickedArray[r] = 0;
}

if (sessionStorage.getItem('username') != null) {
  document.getElementById('messageFromUser').placeholder = "What is happening " + sessionStorage.getItem('username') + "?";
}
else {
  window.location.href = "login.html";
}

var interval;

function resetEventListeners() {
  document.getElementById('user-form').addEventListener('click', e => {

    if (canPressButton != 0) {
      return;
    }

    canPressButton = 1;

    var userOfPage = sessionStorage.getItem('username');
    var message = document.getElementById('messageFromUser').value;

    if (message == "") {
      e.preventDefault();

      return;
    }

    if (message.length > 200) {
      e.preventDefault();

      alert('You can only send messages that have less than 200 letters!');

      return;
    }

    var urlToFetch = "https://mainserver.agenthacker.repl.co/api/add?user=" + userOfPage + "&message=" + message;

    fetch(urlToFetch)
    .then(console.log('Success'))

    interval = setInterval(clearAllMessage, 500);
  })

  // refresh the page when the refresh button is clicked

  document.getElementById('refresh').addEventListener('click', e => {
    clearAllMessage();
  })
}

resetEventListeners();

// Function to clear the webpage of the message

function clearAllMessage() {
  clearInterval(interval);

  canPressButton = 0;

  displayArea.innerHTML = '<form class="text-send" id="text-send"><input type="text" id="messageFromUser" autocomplete="off" placeholder="What is going on?"><button id="user-form">Send</button></form> <h2 class="refresh" id="refresh"><i class="fas fa-sync-alt"></i></h2>'

  resetEventListeners();

  document.getElementById('messageFromUser').placeholder = "What is happening " + sessionStorage.getItem('username') + "?";

  getJsonFromServerFiles();
}

// Function to locate and request the current messages from the server

function getJsonFromServerFiles() {
  fetch('https://mainserver.agenthacker.repl.co/api/users')
  .then(res => {
    return res.json();
  })
  .then(data => {
    decodeAndDisplayDataFromServer(data);

    getDataAboutUsers();
  })
}

function getDataAboutUsers() {

  window.scrollBy(0, scrollAmount);
  scrollAmount = 0;

  fetch('https://mainserver.agenthacker.repl.co/api/logins')
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

  for (var x = 0; x < 10000; x++) {
    var elementsID = x * 2;

    var item = document.getElementById(elementsID);

    if (item == null) {
      return;
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

  repeatTimesForLoop = seperatedText.length;

  if (repeatTimesForLoop > refreshAmountDisplay) {
    repeatTimesForLoop = refreshAmountDisplay;
  }

  for(var z = 0; z < repeatTimesForLoop; z += 2) {
    var i = seperatedText.length - z - 2;
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

    savedSeperatedText = seperatedText;

    var reportButton = document.createElement('button');
    reportButton.innerText = "Report";
    reportButton.classList.add('clicked-report-default');
    reportButton.title = "Report this comment for unallowed or bad content"

    if (buttonClickedArray[i] == 1) {
      reportButton.classList.add('clicked-report');
      reportButton.classList.remove('clicked-report-default');
    }

    reportButton.id = i + "n";
    reportButton.addEventListener('click', e => {
      var reportButtonClicked = e.target;

      var reportedID = reportButtonClicked.id;
      var lengthOfID = reportButtonClicked.id.length;
      lengthOfID = Number(lengthOfID) - 1;
      reportedID = reportedID.substring(0, lengthOfID);

      if (buttonClickedArray[Number(reportedID)] == 1) {
        return;
      }

      buttonClickedArray[Number(reportedID)] = 1;
      reportButtonClicked.innerText = "Reported";
      reportButtonClicked.classList.add('clicked-report');
      reportButtonClicked.classList.remove('clicked-report-default');

      var usernameOfReportedPerson = savedSeperatedText[Number(reportedID)];
      var messageOfReportedUser = savedSeperatedText[Number(reportedID) + 1];

      var urlOfReportAdd = "https://mainserver.agenthacker.repl.co/api/reports/add?username=" + usernameOfReportedPerson + "&message=" + messageOfReportedUser;

      fetch(urlOfReportAdd)
      .then(console.log('Success'))
    })

    chatElement.appendChild(atElement);
    chatElement.appendChild(usernameAtElement);
    chatElement.appendChild(userSpeech);
    chatElement.appendChild(reportButton);

    displayArea.appendChild(chatElement);

    var spacing = document.createElement('div');
    spacing.classList.add('spacing');

    displayArea.appendChild(spacing);
  }

  var loadMoreButton = document.createElement('button');
  loadMoreButton.classList.add('load-more');
  loadMoreButton.innerText = "Load More";
  loadMoreButton.addEventListener('click', e => {

    if (refreshAmountDisplay > savedSeperatedText.length) {
      return;
    }

    scrollAmount = window.scrollY;

    refreshAmountDisplay = refreshAmountDisplay + 50;

    clearAllMessage();
  })

  var spacingForLoadMore = document.createElement('br'); 

  displayArea.appendChild(loadMoreButton);
  displayArea.appendChild(spacingForLoadMore);

  getDataAboutUsers();
}

// Check the media of the user

function checkMediaOfUser(media) {
  if (media.matches) 
  {
    // User is on a mobile device

    document.getElementById('text-send').classList.add('mobile');
    

  } else {
    //User is not on a mobile device

    document.getElementById('text-send').classList.remove('mobile');
  }
}

// Get the media data every update

var x = window.matchMedia("(max-width: 700px)")
checkMediaOfUser(x)
x.addListener(checkMediaOfUser)

// Set a interval to update the page every 5 seconds
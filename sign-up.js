
var seperatedText;

const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '_', '/', '.', ',', '~', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

const scrambledAlphabet = ['g', 'b', 'd', 'c', 'h', 'f', 'a', 'e', 'j', 'i', 'l', 'k', 'o', 'n', 'm', ',', 'q', 'r', 's', '_', 'u', '2', '~', '0', 'x', 'z', '1', 'v', '3', '6', '5', '4', '9', '7', '8', 'y', 't', '/', '.', 'p', 'w', 'B', 'A', 'C', 'V', 'W', 'F', 'P', 'H', 'I', 'O', 'K', 'L', 'N', 'M', 'J', 'G', 'Q', 'Y', 'S', 'T', 'U', 'D', 'E', 'X', 'R', 'Z'];

// Fetch the logins ready for the login page

fetch('https://mainserver.agenthacker.repl.co/api/logins')
  .then(res => {
    return res.json();
  })
  .then(data => {
    loginCheckWithData(data);
  })

  function loginCheckWithData(logins) {
    var dataArray = logins.data;

    var decodedMessage = String.fromCharCode(...dataArray);

    seperatedText = decodedMessage.split("||");
    seperatedText.pop();
  }

  // Get all the needed elements to check the form

const password = document.getElementById('password');
const usersName = document.getElementById('username');

// Add all the event listeners

document.getElementById('submit-button').addEventListener('click', e => {
  
  // Locate the next empty spot in the localStorage

  var isSafeToAddUserData = 0;

  if (usersName.value.includes("|")) {
      alert('Cannot use the "|" char as it is not supported!')

      isSafeToAddUserData = 1;
    }

  for (var i = 0; i < seperatedText.length; i += 3) {

      var username = seperatedText[i];
      var usersPass = seperatedText[i + 1];

      if (usersName.value == username) {
        isSafeToAddUserData = 1;
      }

    }

    if (isSafeToAddUserData == 0) {
      sessionStorage.setItem('username', usersName.value);

        // Add the username and password to the database

        var passwordOfUser = password.value;
        var encodedPass = "";

        for (var z = 0; z < password.value.length; z++) {
          var currentItem = passwordOfUser[z];

          // Find item in alphabet
          
          for (var y = 0; y < alphabet.length; y++) {

            if (alphabet[y] == currentItem) {
              encodedPass = encodedPass + scrambledAlphabet[y];

              break;
            }

            if (alphabet[y] != currentItem && y == alphabet.length - 1) {

              e.preventDefault();

              alert('You can only use letters or numbers for your username');

              return;
            }
          }
        }

        var urlToFetch = "https://mainserver.agenthacker.repl.co/api/add/user?username=" + usersName.value + "&pass=" + encodedPass;

        fetch(urlToFetch)
          .then(console.log('Success'))

        return;
    }

  // No account found

  e.preventDefault();
  alert('Account username already exists!');
})
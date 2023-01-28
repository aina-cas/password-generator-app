'use strict';

//Adding working and connected functions to the top of the page 

//  Function to display character length 
// Takes input from character length range bar and display character Length as a number   
function displayCharacterLength() {
  // Starting with element
  let length = document.getElementById('status').value;
  // Displays the character length on the page
  document.getElementById('character-length').innerHTML = length;
}

// Helper function to be used in the passwordGenerator function to assist with selecting random characters for the password
// Returns a random character type, depending on the specified options
function getRandomType(includeUppercase, includeLowercase, includeNumbers, includeSymbols) {
  let types = '';
  if (includeUppercase) {
    types += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  }
  if (includeLowercase) {
    types += 'abcdefghijklmnopqrstuvwxyz';
  }
  if (includeNumbers) {
    types += '0123456789';
  }
  if (includeSymbols) {
    types += '!@#$%^&*()_+-=[]{}|;:\'",.<>/?`~';
  }
  return types;
}

// Another helper function to make sure that at least one character is included in the password 
// Returns a random character from the specified string of characters
function getRandomCharacter(characters) {

  return characters.charAt(Math.floor(Math.random() * characters.length));
}


// The main password generating function 


function passwordGenerator() {
  let length = document.getElementById('status').value;
  let includeUppercase = document.getElementById('uppercase').checked;
  let includeLowercase = document.getElementById('lowercase').checked;
  let includeNumbers = document.getElementById('numbers').checked;
  let includeSymbols = document.getElementById('symbols').checked;

  let password = '';
  let characters = '';

  // If no characters are selected, the function returns an empty string
  if (length === 0) {
    password = '';
  }

  // Add at least one character of each selected type to the password

  if (includeUppercase) {
    password += getRandomCharacter('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
  }
  if (includeLowercase) {
    password += getRandomCharacter('abcdefghijklmnopqrstuvwxyz');
  }
  if (includeNumbers) {
    password += getRandomCharacter('0123456789');
  }
  if (includeSymbols) {
    password += getRandomCharacter('!@#$%^&*()_+-=[]{}|;:\'",.<>/?`~');
  }



  // Generate the rest of the password by selecting random characters from the string of characters
  // for the remaining length, using the function getRandomCharacter()
  while (password.length < length) {
    let type = getRandomType(includeUppercase, includeLowercase, includeNumbers, includeSymbols);
    let character = getRandomCharacter(type);
    password += character;
  }

  document.getElementById('passwordform').placeholder = password;
}

const generateBtn = document.getElementById('button');

generateBtn.addEventListener('click', passwordGenerator);






/////////////////////////////////////////////////////////////////////////////////////////////



// 1. Function to display password 

// Starting with password 
// let password = passwordGenerator();                                                    // Need to figure out how to include user input re: uppercase, lowercase, symbols, numbers, etc.? 

// Displays password within the <h2> element 


// 2. Function to copy password 

// Starting with the element 
let copyButton = document.querySelector('.fa-copy');                                // Need to pull/add ID for copy button from HTML 
copyButton.addEventListener("click", copyPassword);

// Calling addEventListener method on the copyButton element, so the user can click on the button and trigger the method
// copyButton.addEventListener('click', copyPassword);

function copyPassword() {
  // Starting with the password value
  let passwordValue = document.getElementById('passwordform').placeholder;                   // Need to add 'copy-password' ID in HTML
  // Calling the writeText method on the clipboard API, and then using then/catch Promise methods
  navigator.clipboard.writeText(passwordValue).then(() => {
    alert('Copied!');
  }).catch(err => {
    alert('Oops, unable to copy');
  });
}



/*

// Parameters: length - how long the password should be 
// includeUppercase - boolean value, if true, includes uppercase and same with the others. If false , will not include. 

function passwordGenerator(length, includeUppercase, includeLowercase, includeNumbers, includeSymbols) {

    // Starting with an empty password block scoped variable 
    let password = '';
  
    // Create a string of all the possible characters to include in the password
    let characters = '';
    
    // depending on includeUppercase function comes back true or false this will either include or exclude uppercase characters 
    if (includeUppercase) {
      characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    }

    // Separate if statements for each case 
    if (includeLowercase) {
      characters += 'abcdefghijklmnopqrstuvwxyz';
    }
    if (includeNumbers) {
      characters += '0123456789';
    }
    if (includeSymbols) {
      characters += '!@#$%^&*()_+-=[]{}|;:\'",.<>/?`~';
    }
  
    // If no characters are selected, the function returns an empty string 
    if (characters.length === 0) {
      return '';
    }
  
    // Generate the password by selecting a random character from the string of characters for the specified length
    for (let i = 0; i < length; i++) {
      password += characters.charAt(Math.floor(Math.random() * characters.length));
    }
  
    return password;
  }
  
  // Example: 
  passwordGenerator(12, true, true, true, false);
  //Output will generate a password 12 characters long including uppercase, lowercase and number, but no symbols. 
 
  // The problem with this function is, that ,for example, even if all parameters are true, the function could still skip 
  //one or more particular characters and generate a password without an uppercase or other, even though it was selected. So bellow hopefully is a solution 

*/


///////////////////////////////////////////////////////////////////////////




// Example:
// passwordGenerator(12, true, true, true, false);
// Output: a password 12 characters long including at least one uppercase, lowercase, and number character, but no symbols.




///////////////////////////////////////////////////////////////////////


// document.querySelectorAll('check-box-effect').forEach(e => e.addEventListener('click', passwordStrength));

const checkboxes = document.querySelectorAll('input[type=checkbox]');
checkboxes.forEach((e) => {
  e.addEventListener('click', passwordStrength)
});



// Password strength color function 


// If parameteres return true, strength variable is increesed by one. 
function passwordStrength() {
  const strengthColorBars = document.querySelectorAll('.vl');
  // console.log(strengthColorBars);
  let includeUppercase = document.getElementById('uppercase').checked;
  let includeLowercase = document.getElementById('lowercase').checked;
  let includeNumbers = document.getElementById('numbers').checked;
  let includeSymbols = document.getElementById('symbols').checked;

  let strength = 0;
  let strengthColorBar = '';
  let strengthText = '';

  if (includeUppercase) {
    strength++;
  }
  if (includeLowercase) {
    strength++;
  }
  if (includeNumbers) {
    strength++;
  }
  if (includeSymbols) {
    strength++
  }

  //Based on the value of the variable 'strength' changing strengthColorBar value with a string of color 
  //to represent strength
  if (strength === 1) {
    // change color bar
    // Bar 1 - change to red
    // Bars 2, 3, 4 - keep default color
    // change text
    strengthColorBars[0].style.backgroundColor = '#F64A4A'; // returns red;
    strengthColorBars[1].style.backgroundColor = '#18171F'; //Strength bar default black color
    strengthColorBars[2].style.backgroundColor = '#18171F'; //Strength bar default black color
    strengthColorBars[3].style.backgroundColor = '#18171F'; //Strength bar default black color
    strengthText = 'TOO WEAK!';
    document.getElementById('strength-text').innerHTML = strengthText;
  }
  else if (strength === 2) {
    // change color bar
    // Bar 1, 2 - change to orange
    // Bars 3, 4 - keep default color
    // change text
    strengthColorBars[0].style.backgroundColor = '#F64A4A';
    strengthColorBars[1].style.backgroundColor = '#F64A4A';
    strengthColorBars[2].style.backgroundColor = '#18171F'; //Strength bar default black color
    strengthColorBars[3].style.backgroundColor = '#18171F'; //Strength bar default black color
    strengthText = 'WEAK';
    document.getElementById('strength-text').innerHTML = strengthText;
  }
  else if (strength === 3) {
    // change color bar
    // Bar 1, 2, 3 - yellow
    // Bar 4 - default color
    // change text
    strengthColorBars[0].style.backgroundColor = '#F8CD65'; // returns yellow
    strengthColorBars[1].style.backgroundColor = '#F8CD65'; // returns yellow
    strengthColorBars[2].style.backgroundColor = '#F8CD65'; // returns yellow
    strengthColorBars[3].style.backgroundColor = '#18171F'; //Strength bar default black color
    strengthText = 'MEDIUM';
    document.getElementById('strength-text').innerHTML = strengthText;
  }
  else if (strength === 4) {
    // change color bar
    // all bars - green
    // change text
    strengthColorBars[0].style.backgroundColor = '#A4FFAF'; //Returns green
    strengthColorBars[1].style.backgroundColor = '#A4FFAF'; //Returns green
    strengthColorBars[2].style.backgroundColor = '#A4FFAF'; //Returns green
    strengthColorBars[3].style.backgroundColor = '#A4FFAF'; //Returns green
    strengthText = 'STRONG';
    document.getElementById('strength-text').innerHTML = strengthText;
  } else {
    strengthColorBars[0].style.backgroundColor = '#18171F'; //Strength bar default black color
    strengthColorBars[1].style.backgroundColor = '#18171F'; //Strength bar default black color
    strengthColorBars[2].style.backgroundColor = '#18171F'; //Strength bar default black color
    strengthColorBars[3].style.backgroundColor = '#18171F'; //Strength bar default black color
    strengthText = 'STRENGTH'; //Strength text is an empty string
    document.getElementById('strength-text').innerHTML = strengthText;
  }

  //   const divs = document.querySelectorAll('.vl');
  //   for (let i = 0; i < strength; i++) {
  //     if (i < strength) {
  //       if (strength === 1) {
  //         div
  //       }
  //     }
  //   }
  // console.log(strength);
}


//Example:

// passwordStrength(true, true, false, false);
//Output {strengthColorBar: '#FB7C58', strengthText: 'WEAK'}

/*
Update!
Function updated as mentioned bellow


As I'm looking at this function, it seems to me I have to write another one for changing strength text,
 which is going to look pretty similar, almost exacly the same.
Any ideas how to avoid repettion? Perhaps we could include another variable in the passworStrength function like
strengthText and return and object, for example :

           retrun {
            strengthColorBar : strengthColorBar,
            strengthText : strengthText
           };

  The passwordStrength function would only add couple more lines for example :

           ......

           if (strength === 0) {
              strengthText = '';
              strengthColorBar = '#18171F';
           } else if (strength === 1) {
              strengthText = 'Too weak!';
              strengthColorBar = '#F64A4A';

            ......

*/


////////////////////////////////////////////////////////////////////////
/*
//Include uppercase function 

function includeUppercase() {
  //get reference to the checkbox 
  let checkbox = document.getElementById('uppercase');

  //Access the checked property of the checkbox element. If its checked property is true, 
  //then the checkbox is checked, otherwise, it is not.
  if (checkbox.checked) {
    return true;
  } else {
    return false;
  }
}


///////////////////////////////////////////////////////////////////////

//Include lowercase function 


//function the same principle as above 
function includeLowercase() {
  let checkbox = getElementById('lowercase');

  if (checkbox.checked) {
    return true;
  } else {
    return false;
  }
}


//////////////////////////////////////////////////////////////////////////

//Include numbers function 

//function the same principle as above
function includeNumbers() {
  let checkbox = getElementById('numbers');

  if (checkbox.checked) {
    return true;
  } else {
    return false;
  }
}


//////////////////////////////////////////////////////////////////////////////////

//Include symbols function 

//Function the same principle as above 
function includeSymbols() {
  let checkbox = getElementById('symbols');

  if (checkbox.checked) {
    return true;
  } else {
    return false;
  }
}
*/

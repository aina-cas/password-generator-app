

//Adding working and connected functions to the top of the page 

//  Function to display character length 
    // Takes input from character length range bar and display character Length as a number   
    function displayCharacterLength() {
      // Starting with element
      let length = document.getElementById('status').value;    
      // Displays the character length on the page
      document.getElementById('character-length').innerHTML = length;                     
    }


    /////////////////////////////////////////////////////////////////////////////////////////////

    

// 1. Function to display password 

    // Starting with password 
    let password = passwordGenerator();                                                    // Need to figure out how to include user input re: uppercase, lowercase, symbols, numbers, etc.? 

    // Displays password within the <h2> element 
    function displayPassword() { 
      document.getElementById('password-display').innerHTML = password;                    // Need to add id 'password-display' to the <h2> element
    };

// 2. Function to copy password 

    // Starting with the element 
    let copyButton = document.getElementById('copy-button');                                // Need to pull/add ID for copy button from HTML 

    // Calling addEventListener method on the copyButton element, so the user can click on the button and trigger the method
    copyButton.addEventListener('click', copyPassword);

    function copyPassword() {
      // Starting with the password value
      let passwordValue = document.getElementById('copy-password').value;                   // Need to add 'copy-password' ID in HTML
      // Calling the writeText method on the clipboard API, and then using then/catch Promise methods
      navigator.clipboard.writeText(password).then(() => {
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
  function passwordGenerator(length, includeUppercase, includeLowercase, includeNumbers, includeSymbols) {
    let password = '';
    let characters = '';
  
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
  
    // If no characters are selected, the function returns an empty string
    if (password.length === 0) {
      return '';
    }
  
    // Generate the rest of the password by selecting random characters from the string of characters
    // for the remaining length, using the function getRandomCharacter()
    while (password.length < length) {
      let type = getRandomType(includeUppercase, includeLowercase, includeNumbers, includeSymbols);
      let character = getRandomCharacter(type);
      password += character;
    }
  
    return password;
  }
  
  // Example:
  passwordGenerator(12, true, true, true, false);
  // Output: a password 12 characters long including at least one uppercase, lowercase, and number character, but no symbols.
  



///////////////////////////////////////////////////////////////////////




  // Password strength color function 
  
  // If parameteres return true, strength variable is increesed by one. 
  function passwordStrength (includeUppercase, includeLowercase, includeNumbers, includeSymbols) {
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
    if (strength === 0) {
      strengthColorBar= '#18171F'; //Strength bar default black color
      strengthText = ''; //Strength text is an empty string
    }
    else if (strength === 1) {
      strengthColorBar = '#F64A4A' //Returns red
      strengthText = 'TOO WEAK!'; 
    }
    else if (strength === 2) {
      strengthColorBar = '#FB7C58'; //Returns orange
      strengthText = 'WEAK';
    }
    else if (strength === 3) {
      strengthColorBar = '#F8CD65'; //Returns yellow
      strengthText = 'MEDIUM'
    }
    else {
      strengthColorBar = '#A4FFAF'; //Returns green
      strengthText = 'STRONG';
    }

    return {
      strengthColorBar : strengthColorBar,
      strengthText : strengthText
    };
  }


//Example:

passwordStrength(true, true, false, false);
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

//Include uppercase function 

function includeUppercase () {
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
function includeLowercase () {
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
function includeNumbers () {
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
function includeSymbols () {
  let checkbox = getElementById('symbols');

  if (checkbox.checked) {
    return true;
  } else {
    return false;
  }
}

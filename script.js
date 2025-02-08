function usernameValidHandler(username, errorDisplay) {
  const regex = /^(?!^(.)\1+$)[A-Za-z0-9]+$/;
  let errorLi = document.createElement("li");

  if (!regex.test(username)) {
    errorLi.textContent =
      "The username must contain at least two unique characters & no special characters or whitespace";
    showErrorDisplay(errorDisplay, errorLi);
    return false;
  }
  return true;
}

function emailValidHandler(email, errorDisplay) {
  let errorLi = document.createElement("li");
  //this will slice the string starting from the index of @
  if (email.slice(email.indexOf("@") + 1) === "example.com") {
    errorLi.textContent = "The domain name should not be example.com";
    showErrorDisplay(errorDisplay, errorLi);
    return false;
  }
  return true;
}

function passwordValidHandler(password1, username, errorDisplay) {
  const password2 = document.getElementById("password2").value;
  let isValid = true;

  // Check if password contains "password"
  (function checkPhrasePassword(password1) {
    let regex = /^(?!.*password).*$/i;
    let errorLi = document.createElement("li");
    if (!regex.test(password1)) {
      errorLi.textContent =
        "The password should not contain the phrase 'password'";
      showErrorDisplay(errorDisplay, errorLi);
      isValid = false;
    }
  })(password1);

  // Check if passwords match
  (function checkPasswordMatch(password1, password2) {
    if (password1 !== password2) {
      let errorLi = document.createElement("li");
      errorLi.textContent = "The passwords did not match";
      showErrorDisplay(errorDisplay, errorLi);
      isValid = false;
    }
  })(password1, password2);

  // Check if password contains username
  (function lookForUsername(password1, username) {
    let regex = new RegExp(`^(?!.*${username}).*$`, "i");
    let errorLi = document.createElement("li");
    if (!regex.test(password1)) {
      errorLi.textContent = "The password should not contain the username";
      showErrorDisplay(errorDisplay, errorLi);
      isValid = false;
    }
  })(password1, username);

  return isValid;
}

function showErrorDisplay(errorDisplay, errorLi) {
  errorDisplay.appendChild(errorLi);
  // Ensures visibility when an error occurs
  errorDisplay.style.display = "flex";
}

// Listen to the registration form
const registerForm = document.getElementById("registration");

registerForm.addEventListener("submit", (e) => {
  //Prevents Default form submit
  e.preventDefault();
  //Made those elements available for they're needed
  const username = document.getElementById("regUsername").value;
  const email = document.getElementById("regEmail").value;
  const password1 = document.getElementById("password1").value;
  const errorDisplay = document.getElementById("errorDisplay");

  // Clear all previous errors and hides error display
  errorDisplay.innerHTML = "";
  errorDisplay.style.display = "none";

  let regFormIsValid =
    usernameValidHandler(username, errorDisplay) &&
    emailValidHandler(email, errorDisplay) &&
    passwordValidHandler(password1, username, errorDisplay);

  if (regFormIsValid) {
    // clears the localStorage
    localStorage.clear();
    localStorage.setItem("Username", username.toLowerCase());
    localStorage.setItem("Email", email);
    localStorage.setItem("Password", password1);
  }
});

//! Part 4 Login Form
// Grab references to DOM elements
const loginForm = document.getElementById("login");
const successDisplay = document.getElementById("successDisplay");
const loginMessage = document.createElement("li");

// Listen for the form's "submit" event
loginForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent default submission

  // Clear previous success and error messages
  successDisplay.innerHTML = "";
  const errorDisplay = document.getElementById("errorDisplay");
  errorDisplay.innerHTML = "";
  errorDisplay.style.display = "none";

  const typedUsername = loginForm
    .querySelector('input[name="username"]')
    .value.trim();
  const typedPassword = loginForm
    .querySelector('input[name="password"]')
    .value.trim();
  const keepLoggedIn = loginForm.querySelector('input[name="persist"]').checked;

  const storedUsername = localStorage.getItem("Username");
  const storedPassword = localStorage.getItem("Password");

  let errorLi;

  // 1) Check if user exists
  if (!storedUsername || !storedPassword) {
    errorLi = document.createElement("li");
    errorLi.textContent =
      "No user found in localStorage. Please register first.";
    showErrorDisplay(errorDisplay, errorLi);
    return;
  }

  // 2) Check username
  if (typedUsername.toLowerCase() !== storedUsername) {
    errorLi = document.createElement("li");
    errorLi.textContent = "Username does not exist.";
    showErrorDisplay(errorDisplay, errorLi);
    return;
  }

  // 3) Check password
  if (typedPassword !== storedPassword) {
    errorLi = document.createElement("li");
    errorLi.textContent = "Incorrect password.";
    showErrorDisplay(errorDisplay, errorLi);
    return;
  }

  // 4) If successful login:
  loginForm.reset();
  successDisplay.innerHTML = "";
  successDisplay.style.display = "flex";

  let successMsg = document.createElement("li");
  successMsg.textContent = "Login successful!";
  if (keepLoggedIn) {
    successMsg.textContent += " You will be kept logged in.";
  }
  successDisplay.appendChild(successMsg);
});

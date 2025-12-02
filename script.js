/* script.js */
"use strict";

/* ---------------- NAV TOGGLE (keeps existing inline onclick working) -------------- */
function myFunction() {
  const links = document.getElementById("myLinks");
  // make selector tolerant of anchor OR button for the toggle
  const toggle = document.querySelector(".topnav .icon");

  if (!links) return;

  // toggle open class for mobile
  const isOpen = links.classList.toggle("open");

  // set ARIA for accessibility (true/false)
  if (toggle) {
    toggle.setAttribute("aria-expanded", String(isOpen));
  }
}

/* ---------------- Validation messages ---------------- */
const messages = {
  success: "The form was submitted successfully",
  failure: "There was an issue when trying to submit the form, please correct your errors and try again",
  emailMsg: "Please enter a valid email address (example: you@example.com)",
  phoneMsg: "Please enter a valid phone number (example: (555) 123-4567)",
  nameMsg: "Please enter your full name",
  msgMsg: "Please let us know what you need (at least 10 characters)",
  contactPrefMsg: "Please choose a preferred contact method"
};

/* ---------------- user object ---------------- */
let newUser = {
  userName: "",
  userEmail: "",
  userPhone: "",
  userChoice: "",
  userMessage: "",
  getUser: function(){
    return `
      <strong>Full Name: </strong> ${this.userName || "(none)"}<br>
      <strong>Email:</strong> ${this.userEmail || "(none)"}<br>
      <strong>Phone:</strong> ${this.userPhone || "(none)"}<br>
      <strong>Preferred contact:</strong> ${this.userChoice || "(none)"}<br>
      <strong>Message:</strong> ${this.userMessage || "(none)"}<br>
    `;
  }
};

/* ---------------- validate form ---------------- */
function validateForm(event){
  event.preventDefault(); // always prevent until validation finishes
  console.clear();
  console.info("validateForm: starting validation");

  const uName = document.getElementById("fullName");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");
  const fieldset = document.querySelector("fieldset");
  const confirm = document.getElementById("confirm");

  // create / ensure contactPrefError element (inserted after the fieldset)
  let contactPrefError = document.getElementById("contactPrefError");
  if(!contactPrefError && fieldset){
    contactPrefError = document.createElement("p");
    contactPrefError.id = "contactPrefError";
    contactPrefError.className = "hidden";
    contactPrefError.style.color = "#ff6b6b";
    contactPrefError.style.marginTop = "0.35rem";
    contactPrefError.textContent = messages.contactPrefMsg;
    fieldset.insertAdjacentElement("afterend", contactPrefError);
  }

  // helpful adjacent <p> elements (create if missing and set text)
  let emailHelp = email ? email.nextElementSibling : null;
  let phoneHelp = phone ? phone.nextElementSibling : null;

  if(uName && (!uName.nextElementSibling || uName.nextElementSibling.tagName.toLowerCase() !== "p")){
    const p = document.createElement("p");
    p.className = "hidden";
    p.textContent = messages.nameMsg;
    uName.insertAdjacentElement("afterend", p);
  }
  if(email && (!emailHelp || emailHelp.tagName.toLowerCase() !== "p")){
    const p = document.createElement("p");
    p.className = "hidden";
    p.textContent = messages.emailMsg;
    email.insertAdjacentElement("afterend", p);
    emailHelp = p;
  }
  if(phone && (!phoneHelp || phoneHelp.tagName.toLowerCase() !== "p")){
    const p = document.createElement("p");
    p.className = "hidden";
    p.textContent = messages.phoneMsg;
    phone.insertAdjacentElement("afterend", p);
    phoneHelp = p;
  }

  // msg error element (exists in HTML as #msgError)
  const msgEl = document.getElementById("msg");
  const msgError = document.getElementById("msgError");
  if(msgError) msgError.classList.add("hidden");

  // remove previous error styles/messages
  [uName, email, phone, msgEl].forEach(el => { if(el) el.classList.remove("error"); });
  if(uName && uName.nextElementSibling) uName.nextElementSibling.classList.add("hidden");
  if(emailHelp) emailHelp.classList.add("hidden");
  if(phoneHelp) phoneHelp.classList.add("hidden");
  if(contactPrefError) contactPrefError.classList.add("hidden");
  if(confirm) { confirm.classList.add("hidden"); confirm.innerHTML = ""; }

  // regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const phoneRegex = /^\+?([0-9]{1,3})?[-.\s]?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;

  let isValid = true;
  newUser.userName = "";
  newUser.userEmail = "";
  newUser.userPhone = "";
  newUser.userChoice = "";
  newUser.userMessage = "";

  // Full name required
  if(!uName || uName.value.trim() === ""){
    isValid = false;
    if(uName) uName.classList.add("error");
    if(uName && uName.nextElementSibling) uName.nextElementSibling.classList.remove("hidden");
    console.error("Validation: full name required");
  } else {
    newUser.userName = uName.value.trim();
  }

  // Message required, min length 10
  if(!msgEl || msgEl.value.trim().length < 10){
    isValid = false;
    if(msgEl) msgEl.classList.add("error");
    if(msgError) msgError.classList.remove("hidden");
    console.error("Validation: message too short or missing");
  } else {
    newUser.userMessage = msgEl.value.trim();
  }

  // Contact preference
  const contactPrefs = document.getElementsByName("contactPref");
  let selectedPref = null;
  for(let i = 0; i < contactPrefs.length; i++){
    if(contactPrefs[i].checked) { selectedPref = contactPrefs[i].value; break; }
  }
  if(!selectedPref){
    isValid = false;
    if(contactPrefError) contactPrefError.classList.remove("hidden");
    console.error("Validation: contact preference required");
  } else {
    newUser.userChoice = selectedPref;
  }

  const emailVal = email ? email.value.trim() : "";
  const phoneVal = phone ? phone.value.trim() : "";

  if(selectedPref === "email"){
    if(!emailVal || !emailRegex.test(emailVal)){
      isValid = false;
      if(email) email.classList.add("error");
      if(emailHelp) emailHelp.classList.remove("hidden");
      console.error("Validation: invalid email");
    } else {
      newUser.userEmail = emailVal;
    }
    if(phoneVal && !phoneRegex.test(phoneVal)){
      isValid = false;
      if(phone) phone.classList.add("error");
      if(phoneHelp) phoneHelp.classList.remove("hidden");
      console.error("Validation: invalid phone (optional)");
    }
  } else if(selectedPref === "textMsg" || selectedPref === "phone"){
    if(!phoneVal || !phoneRegex.test(phoneVal)){
      isValid = false;
      if(phone) phone.classList.add("error");
      if(phoneHelp) phoneHelp.classList.remove("hidden");
      console.error("Validation: invalid or missing phone");
    } else {
      newUser.userPhone = phoneVal;
    }
    if(emailVal && !emailRegex.test(emailVal)){
      isValid = false;
      if(email) email.classList.add("error");
      if(emailHelp) emailHelp.classList.remove("hidden");
      console.error("Validation: invalid email (optional)");
    }
  } else {
    // if contact pref unknown, be strict and require at least one contact method
    if(!emailVal && !phoneVal){
      isValid = false;
      if(contactPrefError) contactPrefError.classList.remove("hidden");
      console.error("Validation: no contact method provided");
    }
  }

  // final outcome
  if(isValid){
    console.info("Validation: success. Preparing submission...");
    // displaySubmission();

    // clear inputs
    if(uName) uName.value = "";
    if(email) email.value = "";
    if(phone) phone.value = "";
    if(msgEl) msgEl.value = "";
    if(contactPrefs.length) contactPrefs[0].checked = true;

    // hide help text
    if(uName && uName.nextElementSibling) uName.nextElementSibling.classList.add("hidden");
    if(emailHelp) emailHelp.classList.add("hidden");
    if(phoneHelp) phoneHelp.classList.add("hidden");
    if(contactPrefError) contactPrefError.classList.add("hidden");
    if(msgError) msgError.classList.add("hidden");

    console.info(messages.success);
    // Use a user-friendly notification rather than forcing an alert every time:
    // window.alert(messages.success);
  } else {
    console.warn(messages.failure);
    // optionally focus the first error element for accessibility
    const firstError = document.querySelector(".error");
    if(firstError) firstError.focus();
  }
}

/* ---------------- show user object ---------------- */
// function displaySubmission(){
//   const confirm = document.getElementById("confirm");
//   if(!confirm){
//     alert("Submission: " + JSON.stringify(newUser, null, 2));
//     return;
//   }
//   confirm.classList.remove("hidden");
//   confirm.innerHTML = "<strong class=\"large\">Your Information:</strong><br>" + newUser.getUser();
// }

/* ---------------- attach events ---------------- */
document.addEventListener("DOMContentLoaded", function(){
  const form = document.getElementById("contact-us-form");
  if(form){
    form.addEventListener("submit", validateForm);
    console.info("Form listener attached to #contact-us-form");
  } else {
    console.warn("No form found with id #contact-us-form");
  }

  const menuToggle = document.querySelector(".topnav .icon");
  if(menuToggle){

    menuToggle.addEventListener("click", function(e){

      e.preventDefault();
      myFunction();
    });
  }
});
// product display code
(function () {
  document.addEventListener("DOMContentLoaded", function () {
    const serviceButtons = Array.from(document.querySelectorAll(".service-btn"));
    const panels = Array.from(document.querySelectorAll(".service-panel"));

    if (!serviceButtons.length || !panels.length) return;

    function showService(key) {
      panels.forEach(p => {
        const matches = p.getAttribute("data-service") === key;
        p.classList.toggle("hidden", !matches);
      });
      serviceButtons.forEach(btn => {
        const selected = btn.getAttribute("data-service") === key;
        btn.setAttribute("aria-selected", selected ? "true" : "false");
      });

      const display = document.getElementById("servicesDisplay");
      if (display && window.innerWidth < 834) {
        display.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }

    // default — first button with aria-selected="true"
    const defaultBtn =
      serviceButtons.find(b => b.getAttribute("aria-selected") === "true") ||
      serviceButtons[0];

    if (defaultBtn) showService(defaultBtn.getAttribute("data-service"));

    // event listeners
    serviceButtons.forEach(btn => {
      btn.addEventListener("click", function () {
        const key = btn.getAttribute("data-service");
        showService(key);
      });
      btn.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          btn.click();
        }
      });
    });
  });
})();
// Game
document.addEventListener("DOMContentLoaded", function () {
  // elements
  const guessForm = document.getElementById("guess-form");
  const guessInput = document.getElementById("guessInput");
  const guessHelp = document.getElementById("guessHelp");
  const gameResult = document.getElementById("gameResult");
  const resultText = document.getElementById("resultText");
  const numbersShown = document.getElementById("numbersShown");
  const tryAgainHint = document.getElementById("tryAgainHint");
  const guessReset = document.getElementById("guessReset");

  // helper: show element
  function show(el){ if(el) el.classList.remove("hidden"); }
  function hide(el){ if(el) el.classList.add("hidden"); }

  // validate that value is integer between 1 and 10
  function validateGuess(value){
    if(value === "" || value === null) return false;

    const n = Number(value);
    if(!Number.isInteger(n)) return false;
    if(n < 1 || n > 10) return false;
    return true;
  }

  function playRound(userGuess) {
    const random = Math.floor(Math.random() * 10) + 1; // 1-10
    // show results
    show(gameResult);
    numbersShown.innerHTML = `<strong>Your guess:</strong> ${userGuess} &nbsp; • &nbsp; <strong>Random number:</strong> ${random}`;
    if(Number(userGuess) === random){
      resultText.textContent = "🎉 Congratulations — you won!";

    } else {
      resultText.textContent = "Nice try — not a match.";

    }
  }

  // form submit handler
  if(guessForm){
    guessForm.addEventListener("submit", function(e){
      e.preventDefault();

      const val = guessInput.value.trim();
      if(!validateGuess(val)){
        show(guessHelp);
        guessInput.classList.add("error");
        hide(gameResult);
        guessInput.focus();
        return;
      }

      hide(guessHelp);
      guessInput.classList.remove("error");
      playRound(val);
    });
  }

  // reset button
  if(guessReset){
    guessReset.addEventListener("click", function(){
      if(guessInput) { guessInput.value = ""; guessInput.classList.remove("error"); }
      hide(guessHelp);
      hide(gameResult);
      if(guessInput) guessInput.focus();
    });
  }

  // allow Enter key inside input to submit
  if(guessInput){
    guessInput.addEventListener("keypress", function(e){
      if(e.key === "Enter") {
        e.preventDefault();
        guessForm.dispatchEvent(new Event("submit", {cancelable: true}));
      }
    });
  }
});

// -------------------------------------------------------------------------------------------------------------------
// pwa service worker
// -------------------------------------------------------------------------------------------------------------------
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("./serviceWorker.js")
      .then((res) => console.log("service worker registered"))
      .catch((err) => console.log("service worker not registered", err));
  });
}

//start
getUserData();


// -------------------------------------------------------------------------------------------------------------------
// function of seeing the user is login or not
// -------------------------------------------------------------------------------------------------------------------
async function getUserData() {
  const response = await fetch("/user");
  const data = await response.json();
  if (!data[0].message) {
    window.location.href = "/homepage.html";
  } else {

    login();
    register();

    // add event listener to all modalBox
    const modalBoxs = document.querySelectorAll(".modalbox");
    for (const modalBox of modalBoxs) {
      modalBox.addEventListener("click", (e) => {
        e.stopPropagation();
      });
    }

    //add event listener to login button
    document.querySelector(".loginButton").addEventListener("click", () => {
      const modal = document.querySelector("#modal-login");
      const cancelButton = document.querySelector(".loginCancel");

      modal.classList.add("show");
      modal.addEventListener("click", (e) => {
        modal.classList.remove("show");
      });

      cancelButton.addEventListener("click", (e) => {
        e.preventDefault();
        modal.classList.remove("show");
      });
    });

    //add event listener to button inside register box
    document.querySelector(".registerButton").addEventListener("click", (e) => {
      e.preventDefault();
      const modal = document.querySelector("#modal-register");
      const cancelButton = document.querySelector(".registerCancel");

      modal.classList.add("show");

      modal.addEventListener("click", () => {
        modal.classList.remove("show");
      });

      cancelButton.addEventListener("click", (e) => {
        e.preventDefault();
        modal.classList.remove("show");
      });
    });
  }
}

// -------------------------------------------------------------------------------------------------------------------
// function of login
// -------------------------------------------------------------------------------------------------------------------
async function login() {
  const loginForm = document.querySelector(".loginForm");
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(loginForm);
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || email == "" || !password || password == "") {
      document.querySelector(".loginWarning").innerHTML = /*HTML*/ `
            <h6>請輸入電郵與密碼</h6>
            `;
    } else {
      const body = { email: email, password: password };
      const result = await fetch("/login", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const message = await result.json();
      if (message[0].ok) {
        window.location.href = '/homepage.html';
      } else {
        document.querySelector(".loginWarning").innerHTML = /*HTML*/ `
            <h6>電郵或密碼錯誤</h6>
            `;
      }
    }
  });
}

// -------------------------------------------------------------------------------------------------------------------
// function of register
// -------------------------------------------------------------------------------------------------------------------
async function register() {
  const registerForm = document.querySelector(".registerForm");
  const password = document.querySelectorAll(".checkPassword");
  let checking = false;

  // check password
  for (const passwordform of password) {
    passwordform.addEventListener("keyup", (e) => {
      const password = registerForm.password.value;
      const checkPassword = registerForm.checkPassword.value;
      if (password != checkPassword) {
        document.querySelector(".registerWarning").innerHTML = /*HTML*/ `
                <h6>密碼不一致</h6>
                `;
        checking = false;
      } else {
        document.querySelector(".registerWarning").innerHTML = /*HTML*/ ``;
        checking = true;
      }
    });
  }

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(registerForm);
    const email = formData.get("email");
    const username = formData.get("username");
    const password = formData.get("password");

    if (
      !email ||
      email == "" ||
      !password ||
      password == "" ||
      !username ||
      username == ""
    ) {
      document.querySelector(".registerWarning").innerHTML = /*HTML*/ `
              <h6>請正確填寫全部資料，不可以留空喔</h6>
              `;
    } else if (checking) {
      const result = await fetch("/register", {
        method: "POST",
        body: JSON.stringify({
          email: email,
          username: username,
          password: password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const message = await result.json();
      if (message[0].ok) {
        window.location.href = '/homepage.html';
      } else {
      }
    } else {
    }
  });
}


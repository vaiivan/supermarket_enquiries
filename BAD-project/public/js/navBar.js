// -------------------------------------------------------------------------------------------------------------------
// show the Navbar
// -------------------------------------------------------------------------------------------------------------------
document.querySelector("#Navbar").innerHTML = /*HTML */ `
    <nav class="navbar navbar-expand-lg">
        <div class="container-fluid">
            <a class="navbar-brand" href="/">格過致知</a>
            <button
                class="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span class="navbar-toggler-icon"></span>
            </button>
            <div
                class="collapse navbar-collapse navbarChange"
                id="navbarSupportedContent"
            >
                <!-- search bar -->
            <div class="searchBar">
				    <input
                class="form-control me-2 search"
                type="text"
                placeholder="Search"
                aria-label="Search"
            />
            <button id="mySearch" class="btn btn-light searchButton"><i class="fa-solid fa-magnifying-glass"></i></button>
            </div>
            </div>
            
        </div>
    </nav>`;

// get the user data from server
getUserData();

// -------------------------------------------------------------------------------------------------------------------
// function of getting user data
// -------------------------------------------------------------------------------------------------------------------

async function getUserData() {
  const response = await fetch("/user");
  const data = await response.json();
  console.log(data);
  if (!data[0].message) {
    // show userdata
    document.querySelector(".navbarChange").innerHTML += /*HTML */ `
                <!-- nav items -->
                <a class="camera" href="/camera.html"><button class="btn btn-light cameraButton"><i class="fa-solid fa-camera"></i></button></a>
                <button class="btn btn-light uploadButton"><i class="fa-solid fa-upload"></i></button>
                <!--<button class="btn btn-light profileButton"><i class="fa-solid fa-heart"></i></button>-->
					          <ul class="navbar-nav flex-row flex-wrap ms-md-auto">
                        <a><span class="username">${data[0].username}</span></a>
                        <a class="logoutButton">登出</a>
                    </ul>
        `;

    // show upload and result modal
    document.querySelector('#modalbox').innerHTML = /*HTML */`
    <div id="modal-upload" class="modal">
      <div class="modalbox">
      <div class="information">
        <h3>上傳照片</h3>
        <div class="loginWarning warning"></div>
        <form >
          <input type="file" name="file" class ="btn btn-light"/>
          <button type="summit" class="uploadPicture btn btn-warning">上傳照片</button>
        </form>
        </div>
      </div>
    </div>`

    document.querySelector(".uploadButton").addEventListener("click", () => {
      const modal = document.querySelector("#modal-upload");
      modal.classList.add("show");
      modal.addEventListener("click", (e) => {
        modal.classList.remove("show");
      });
    });



    // add event listener to all modalBox
    const modalBoxs = document.querySelectorAll(".modalbox");
    for (const modalBox of modalBoxs) {
      modalBox.addEventListener("click", (e) => {
        e.stopPropagation();
      });
    }

    logout();
    upload();

    //searching
    document.querySelector("#mySearch").addEventListener("click", (e) => {
      let search = document.querySelector(".search").value.trim();
      window.location = `/inquery.html?search=${encodeURIComponent(search)}`;
    });
  } else {
    // show login button
    document.querySelector(".navbarChange").innerHTML += /*HTML */ `
        <ul class="navbar-nav flex-row flex-wrap ms-md-auto">
            <li class="nav-item loginButton">
                <a class="nav-link">登入</a>
            </li>
        </ul>`;

    //add the login modal
    document.querySelector("#modalbox").innerHTML = /*HTML */ `
    <div id="modal-login" class="modal">
      <div class="modalbox">
        <div class="information">
          <h1>登入</h1>
          <div class="loginWarning warning"></div>
          <form action="/login" method="POST" class="loginForm">
            <div class="form-group">
              <label for="email">電郵</label>
              <input type="email" name="email" placeholder="email" />
            </div>
            <div class="form-group">
              <label for="password">密碼</label>
              <input type="password" name="password" placeholder="Password" />
            </div>
            <div class="buttons">
              <button type="submit" class="btn btn-warning">登入</button>
              <button class="btn btn-info registerButton">註冊</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div id="modal-register" class="modal">
      <div class="modalbox">
        <div class="information">
          <h1>註冊</h1>
          <div class="registerWarning warning"></div>
          <form class="registerForm" action="/register" method="POST">
            <div class="form-group">
              <label for="email">電郵</label>
              <input type="email" name="email" placeholder="Email" />
            </div>
            <div class="form-group">
              <label for="username">暱稱</label>
              <input type="username" name="username" placeholder="Nickname" />
            </div>
            <div class="form-group">
              <label for="password">密碼</label>
              <input class="checkPassword" type="password" name="password" placeholder="Password" />
            </div>
            <div class="form-group">
              <label for="checkPassword">確認密碼</label>
              <input
                class="checkPassword"
                type="password"
                name="checkPassword"
                placeholder="Password"
              />
            </div>
            <div class="buttons">
              <button type="submit" class="btn btn-warning">註冊</button>
              <button class="btn btn-dark cancel">取消</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    `;
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
      modal.classList.add("show");
      modal.addEventListener("click", (e) => {
        modal.classList.remove("show");
      });
    });

    //add event listener to button inside register box
    document.querySelector(".registerButton").addEventListener("click", (e) => {
      e.preventDefault();
      const modalRegister = document.querySelector("#modal-register");
      const modalLogin = document.querySelector("#modal-login");
      const cancelButton = document.querySelector(".cancel");

      modalRegister.classList.add("show");
      modalLogin.classList.remove("show");

      modalRegister.addEventListener("click", () => {
        modalRegister.classList.remove("show");
      });
      cancelButton.addEventListener("click", (e) => {
        e.preventDefault();
        modalRegister.classList.remove("show");
      });
    });

    login();
    register();

    //searching
    document.querySelector("#mySearch").addEventListener("click", (e) => {
      let search = document.querySelector(".search").value.trim();
      window.location = `/inquery.html?search=${encodeURIComponent(search)}`;
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
    console.log(email);
    console.log(password);

    if (!email || email == "" || !password || password == "") {
      document.querySelector(".loginWarning").innerHTML = /*HTML*/ `
            <h6>請輸入電郵與密碼</h6>
            `;
    } else {
      const body = { email: email, password: password };
      console.log(body);
      const result = await fetch("/login", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const message = await result.json();
      if (message[0].ok) {
        window.location.reload();
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
      } else {
        document.querySelector(".registerWarning").innerHTML = /*HTML*/ ``;
        checking = true;
        console.log(checking);
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
      console.log(message);
      if (message[0].ok) {
        window.location.reload();
      } else {
      }
    } else {
    }
  });
}

// -------------------------------------------------------------------------------------------------------------------
// function of logout
// -------------------------------------------------------------------------------------------------------------------
async function logout() {
  const logoutButton = document.querySelector(".logoutButton");
  logoutButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const result = await fetch("/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const message = await result.json();
    console.log(message);
    if (message[0].ok) {
      window.location.reload();
    } else {
    }
  });
}


// -------------------------------------------------------------------------------------------------------------------
// function of upload files
// -------------------------------------------------------------------------------------------------------------------
async function upload() {

  document.querySelector(".uploadPicture").addEventListener("click", async (e) => {
    e.preventDefault();

    document.querySelector(".uploadPicture").setAttribute("disabled", true);
    document.querySelector('.warning').innerHTML = /*HTML*/ `
          <h6>請稍候，正在辨識中...</h6>
    `;

    const formData = new FormData(document.querySelector(".files"));
    const file = formData.get("file");
    if (!file.name || file.name == "") {
      document.querySelector(".warning").innerHTML = /*HTML*/ `
          <h6>請先選擇照片</h6>
          `;
      document.querySelector(".uploadPicture").removeAttribute("disabled");
    } else {
      const response = await fetch("/uploads", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (result.status == "success") {
        document.querySelector(".warning").innerHTML = /*HTML */ `
        <h6>已經成功辨認!</h6><br>
        <h6>結果如下！<br>
            價錢：${result.price}元<br>
            商品名稱：${result.description}<br></h6>`;
        document.querySelector(".uploadPicture").removeAttribute("disabled");;
      } else {
        document.querySelector(".warning").innerHTML = /*HTML*/ `
          <h6>辨認失敗，請再嘗試一次</h6>
          `;
        document.querySelector(".uploadPicture").removeAttribute("disabled");
      }
    }
  })


}



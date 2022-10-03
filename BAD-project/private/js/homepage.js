//start
main();

// -------------------------------------------------------------------------------------------------------------------
// main function
// -------------------------------------------------------------------------------------------------------------------
async function main() {
  const response = await fetch("/user");
  const data = await response.json();
  if (!data[0].message) {
    document.querySelector("h1").innerHTML = /* HTML*/ `
    歡迎！ ${data[0].username}`;

    showUpload();

    document.querySelector(".uploadButton").addEventListener("click", () => {
      const modal = document.querySelector("#modal-upload");
      modal.classList.add("show");
    });

    logout();
    upload();

    //searching
    document.querySelector("#mySearch").addEventListener("click", (e) => {
      let search = document.querySelector(".search").value.trim();
      window.location = `/inquery.html?search=${encodeURIComponent(search)}`;
    });
  } else {
    window.location.href = "/";
  }
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
      window.location.href = "/";
    } else {
    }
  });
}

// -------------------------------------------------------------------------------------------------------------------
// function of upload files
// -------------------------------------------------------------------------------------------------------------------
async function upload() {

  document.querySelector(".uploadCancel").addEventListener("click", async (e) => {
    e.preventDefault()
    const modal = document.querySelector("#modal-upload");
    modal.classList.remove("show");
  })


  document
    .querySelector(".uploadPicture")
    .addEventListener("click", async (e) => {
      e.preventDefault();

      document.querySelector(".uploadPicture").setAttribute("disabled", true);
      document.querySelector(".warning").innerHTML = /*HTML*/ `
          <h6>請稍候，正在辨識中...</h6>
    `;

      const formData = new FormData(document.querySelector(".files"));
      const file = formData.get("file");

      if (!file.name || file.name == "") {
        //if no file selected
        document.querySelector(".warning").innerHTML = /*HTML*/ `
          <h6>請先選擇照片</h6>
          `;
        document.querySelector(".uploadPicture").removeAttribute("disabled");
      } else {
        //fetching
        const response = await fetch("/uploads", {
          method: "POST",
          body: formData,
        });
        const result = await response.json();

        //if success
        if (result.status == "success") {
          document.querySelector(".information").innerHTML = /*HTML */ `
        <h6>已經成功辨認!</h6><br>
        <h6>結果如下！<br>
            價錢：${result.price}元<br></h6>
            商品名稱：<textarea>${result.description}</textarea>
            <p>需要在網站內搜尋這個商品嗎？<p>
            <button class="btn btn-warning resultSearch">搜尋！</button>
            <button class="btn btn-warning again">再辨認一次！</button>
            <button class="btn btn-dark resultCancel">返回</button>
            `;

          // camcel button
          document
            .querySelector(".resultCancel")
            .addEventListener("click", () => {
              document.querySelector("#modal-upload").classList.remove("show");
              showUpload();
              upload();
            });
          // again button
          document.querySelector(".again").addEventListener("click", () => {
            showUpload();
            upload();
            document.querySelector('#modal-upload').classList.add('show');
          });
          // search button
          document
            .querySelector(".resultSearch")
            .addEventListener("click", (e) => {
              let search = document.querySelector("textarea").value.trim();
              window.location = `/inquery.html?search=${encodeURIComponent(
                search
              )}`;
            });

          document.querySelector(".uploadPicture").removeAttribute("disabled");
        } else {
          document.querySelector(".warning").innerHTML = /*HTML*/ `
          <h6>辨認失敗，請再嘗試一次</h6>
          `;
          document.querySelector(".uploadPicture").removeAttribute("disabled");
        }
      }
    });
}

// -------------------------------------------------------------------------------------------------------------------
// function showing upload in modal
// -------------------------------------------------------------------------------------------------------------------

function showUpload() {
  document.querySelector("#modalBox").innerHTML = /* HTML*/ `
    <div id="modal-upload" class="modal">
        <div class="modalbox">
        <div class="information">
          <h3>上傳照片</h3>
          <div class="loginWarning warning"></div>
          <form class="files" method="POST" action="/uploads" enctype="multipart/form-data">
            <input type="file" name="file" class ="btn btn-light"/>
            <button type="summit" class="uploadPicture btn btn-warning">上傳照片</button>
            <button class="btn btn-warning uploadCancel">返回</button>
          </form>
          </div>
        </div>
      </div>`;

    // add event listener to all modalBox
    const modalBoxs = document.querySelectorAll(".modalbox");
    for (const modalBox of modalBoxs) {
      modalBox.addEventListener("click", (e) => {
        e.stopPropagation();
      });
    }
}

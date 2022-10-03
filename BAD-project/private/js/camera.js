// -------------------------------------------------------------------------------------------------------------------
// set params and call the function
// -------------------------------------------------------------------------------------------------------------------
let width = 340; // We will scale the photo width to this
let height = 0; // This will be computed based on the input stream

// |streaming| indicates whether or not we're currently streaming
// video from the camera. Obviously, we start at false.

let streaming = false;

// The various HTML elements we need to configure or control. These
// will be set by the startup() function.

let video = null;
let canvas = null;
let photo = null;
let startbutton = null;

openCamera();
buttons();

// -------------------------------------------------------------------------------------------------------------------
// carmera function
// -------------------------------------------------------------------------------------------------------------------

function openCamera() {
  video = document.querySelector("#video");

  try {
    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: "environment",
        },
        audio: false,
      })
      .then(function (stream) {
        video.srcObject = stream;
        video.play();
      })
      .catch((err) => {
        document.querySelector(".cameraWarning").innerHTML = /*HTML */ `
        <h6>出現錯誤，請刷新頁面後再嘗試</h6>`;
      });

    video.addEventListener(
      "canplay",
      function (ev) {
        if (!streaming) {
          height = video.videoHeight / (video.videoWidth / width);

          // Firefox currently has a bug where the height can't be read from
          // the video, so we will make assumptions if this happens.

          if (isNaN(height)) {
            height = width / (4 / 3);
          }

          video.setAttribute("width", width);
          video.setAttribute("height", height);
          streaming = true;
        }
      },
      false
    );
  } catch (err) {
    document.querySelector(".cameraWarning").innerHTML = /*HTML */ `
      <h6>出現錯誤，請重新整理網頁後再嘗試 </h6>`;
  }
}

// -------------------------------------------------------------------------------------------------------------------
// send the data to the python regonizer and wait for return results
// -------------------------------------------------------------------------------------------------------------------
async function imageToServer() {
  //disable the button
  document.querySelector("#startbutton").setAttribute("disabled", true);
  document.querySelector(".cameraWarning").innerHTML = "辨識中，請稍後...";

  //take the picture
  const canvas = document.querySelector("#canvas");
  const context = canvas.getContext("2d");
  if (width && height) {
    canvas.width = width;
    canvas.height = height;
    context.drawImage(video, 0, 0, width, height);

    let data = canvas
      .toDataURL("image/png")
      .replace(/^data:image\/png;base64,/, "");

    //convert base64 to file
    let blobBin = atob(data, "base64");
    let array = [];
    for (let i = 0; i < blobBin.length; i++) {
      array.push(blobBin.charCodeAt(i));
    }
    let blob = new Blob([new Uint8Array(array)], { type: "image/png" });
    let file = new File([blob], "image.png", { type: "image/png" });

    // upload files
    let formData = new FormData();

    formData.append("file", file);

    let response = await fetch("/uploads", {
      method: "POST",
      body: formData,
    });
    let result = await response.json();

    if (result.status === "success") {

      let price;
      if (result.price.message) {
        price = '---'
      } else {
        price = result.price
      }

      showResult()
      document.querySelector(".information").innerHTML = /*HTML */ `
         <h6>已經成功辨認!</h6><br>
          <h6>結果如下！<br>
          價錢：${price}元</h6>
          商品名稱：<textarea>${result.description}</textarea>
          <p>需要在網站內搜尋這個商品嗎？<p>
          <button class="btn btn-warning resultSearch">搜尋！</button>
          <button class="btn btn-warning again">再辨認一次！</button>`
      
      //show the modal
      document.querySelector("#modal-result").classList.add("show");
      document.querySelector(".cameraWarning").innerHTML = "";

      // again button
      document.querySelector(".again").addEventListener("click", () => {
        document.querySelector("#modal-result").classList.remove("show");
      });
      // search button
      document.querySelector(".resultSearch").addEventListener("click", (e) => {
        let search = document.querySelector("textarea").value.trim();
        window.location = `/inquery.html?search=${encodeURIComponent(search)}`;
      });

      document.querySelector("#startbutton").removeAttribute("disabled");
    } else {
      document.querySelector(".cameraWarning").innerHTML = /*HTML */ `
        <h6>出現錯誤，請刷新頁面後再嘗試</h6>`;
      document.querySelector("#startbutton").removeAttribute("disabled");
    }
  }
}

// -------------------------------------------------------------------------------------------------------------------
// the buttons
// -------------------------------------------------------------------------------------------------------------------

function buttons() {
  //cancel button
  document.querySelector("#cancel").addEventListener("click", (e) => {
    e.preventDefault();
    window.history.back();
  });

  document.querySelector("#startbutton").addEventListener("click", (e) => {
    imageToServer();
  });
}

// -------------------------------------------------------------------------------------------------------------------
// function showing result in modal
// -------------------------------------------------------------------------------------------------------------------

function showResult() {
  document.querySelector("#modalBox").innerHTML = /* HTML*/ `
    <div id="modal-result" class="modal">
        <div class="modalbox">
        <div class="information">
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

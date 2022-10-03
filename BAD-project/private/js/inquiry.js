

// -------------------------------------------------------------------------------------------------------------------
//  Search bar
// -------------------------------------------------------------------------------------------------------------------

async function searchInquiry() {
  let params = new URLSearchParams(window.location.search.trim());
  let target = params.get("search").trim();
  // console.log("params", params);
  // console.log("target", target);
  let response = await fetch(`/inquery?search=${encodeURIComponent(target)}`);
  let results = await response.json();
  console.log("results", results);
  // console.log("results[0]", results[0].product_name);
  // for (let result of results) {
  //   main.innerHTML += `<li class="list-group-item product">${result.product_name}</li>`;

  // }
  let main = document.querySelector("tbody");
  if (results[0].market_name === "PK") {
    main.innerHTML += `<tr">
  <th class="product">${results[0].product_name}</th>
  <th class="brand">${results[0].brand_name}</th>
  <th class="pk">${results[0].price}</th>
    <th class="aeon">---</th>
    <th class="zstore">---</th>
    </tr>`;
  } else if (results[0].market_name === "Aeon") {
    main.innerHTML += `<tr">
  <th class="product">${results[0].product_name}</th>
  <th class="brand">${results[0].brand_name}</th>
  <th class="pk">---</th>
    <th class="aeon">${results[0].price}</th>
    <th class="zstore">---</th>
    </tr>`;
  } else if (results[0].market_name === "Zstore") {
    main.innerHTML += `<tr>
    <th class="product">${results[0].product_name}</th>
    <th class="brand">${results[0].brand_name}</th>
    <th class="pk">---</th>
    <th class="aeon">---</th>
    <th class="zstore">${results[0].price}</th>
    </tr>`;
  }

  for (let i = 1; i < results.length; i++) {

    console.log("result i:",results[i]);
    console.log("i-2:",results[i - 2]);
    console.log("hello world")
    if (results[i].product_name != results[i - 1].product_name) {
      if (results[i].market_name === "PK") {
        main.innerHTML += `<tr>
    <th class="product">${results[i].product_name}</th>
    <th class="brand">${results[i].brand_name}</th>
    <th class="pk" data-id=pk${i}>${results[i].price}</th>
      <th class="aeon" data-id=aeon${i}>---</th>
      <th class="zstore" data-id=zstore${i}>---</th>
      </tr>`;
      } else if (results[i].market_name === "Aeon") {
        main.innerHTML += `<tr>
    <th class="product">${results[i].product_name}</th>
    <th class="brand">${results[i].brand_name}</th>
    <th class="pk" data-id=pk${i}>---</th>
      <th class="aeon" data-id=aeon${i}>${results[i].price}</th>
      <th class="zstore" data-id=zstore${i}>---</th>
      </tr>`;
      } else if (results[i].market_name === "Zstore") {
        main.innerHTML += `<tr>
      <th class="product">${results[i].product_name}</th>
      <th class="brand">${results[i].brand_name}</th>
      <th class="pk" data-id=pk${i}>---</th>
      <th class="aeon" data-id=aeon${i}>---</th>
      <th class="zstore" data-id=zstore${i}>${results[i].price}</th>
      </tr>`;
      }
    } else if (
      results[i].product_name == results[i - 1].product_name &&
      results[i - 1].product_name == results[i - 2].product_name
    ) {
      if (results[i].market_name === "PK") {
        document.querySelector(`th[data-id=pk${i - 2}]`).innerHTML =
          results[i].price;
      } else if (results[i].market_name === "Aeon") {
        document.querySelector(`th[data-id=aeon${i - 2}]`).innerHTML =
          results[i].price;
      } else if (results[i].market_name === "Zstore") {
        document.querySelector(`th[data-id=zstore${i - 2}]`).innerHTML =
          results[i].price;
      }
    } else if (results[i].product_name == results[i - 1].product_name) {
      if (results[i].market_name === "PK") {
        document.querySelector(`th[data-id=pk${i - 1}]`).innerHTML =
          results[i].price;
      } else if (results[i].market_name === "Aeon") {
        document.querySelector(`th[data-id=aeon${i - 1}]`).innerHTML =
          results[i].price;
      } else {
        document.querySelector(`th[data-id=zstore${i - 1}]`).innerHTML =
          results[i].price;
      }
    }
  }
}
searchInquiry();

async function searchDrinks() {
  let response = await fetch(`/searchDrinks`);
  let results = await response.json();
  console.log("Search drink results", results);
  let main = document.querySelector("tbody");
  if (results[0].market_name === "PK") {
    main.innerHTML = `<tr">
  <th class="product">${results[0].product_name}</th>
  <th class="brand">${results[0].brand_name}</th>
  <th class="pk">${results[0].price}</th>
    <th class="aeon">---</th>
    <th class="zstore">---</th>
    </tr>`;
  } else if (results[0].market_name === "Aeon") {
    main.innerHTML = `<tr">
  <th class="product">${results[0].product_name}</th>
  <th class="brand">${results[0].brand_name}</th>
  <th class="pk">---</th>
    <th class="aeon">${results[0].price}</th>
    <th class="zstore">---</th>
    </tr>`;
  } else if (results[0].market_name === "Zstore") {
    main.innerHTML = `<tr>
    <th class="product">${results[0].product_name}</th>
    <th class="brand">${results[0].brand_name}</th>
    <th class="pk">---</th>
    <th class="aeon">---</th>
    <th class="zstore">${results[0].price}</th>
    </tr>`;
  }

  for (let i = 1; i < results.length; i++) {
    if (results[i].product_name != results[i - 1].product_name) {
      if (results[i].market_name === "PK") {
        main.innerHTML += `<tr>
    <th class="product">${results[i].product_name}</th>
    <th class="brand">${results[i].brand_name}</th>
    <th class="pk" data-id=pk${i}>${results[i].price}</th>
      <th class="aeon" data-id=aeon${i}>---</th>
      <th class="zstore" data-id=zstore${i}>---</th>
      </tr>`;
      } else if (results[i].market_name === "Aeon") {
        main.innerHTML += `<tr>
    <th class="product">${results[i].product_name}</th>
    <th class="brand">${results[i].brand_name}</th>
    <th class="pk" data-id=pk${i}>---</th>
      <th class="aeon" data-id=aeon${i}>${results[i].price}</th>
      <th class="zstore" data-id=zstore${i}>---</th>
      </tr>`;
      } else if (results[i].market_name === "Zstore") {
        main.innerHTML += `<tr>
      <th class="product">${results[i].product_name}</th>
      <th class="brand">${results[i].brand_name}</th>
      <th class="pk" data-id=pk${i}>---</th>
      <th class="aeon" data-id=aeon${i}>---</th>
      <th class="zstore" data-id=zstore${i}>${results[i].price}</th>
      </tr>`;
      }
    } else if (
      results[i].product_name == results[i - 1].product_name &&
      results[i - 1].product_name == results[i - 2].product_name
    ) {
      if (results[i].market_name === "PK") {
        document.querySelector(`th[data-id=pk${i - 2}]`).innerHTML =
          results[i].price;
      } else if (results[i].market_name === "Aeon") {
        document.querySelector(`th[data-id=aeon${i - 2}]`).innerHTML =
          results[i].price;
      } else if (results[i].market_name === "Zstore") {
        document.querySelector(`th[data-id=zstore${i - 2}]`).innerHTML =
          results[i].price;
      }
    } else if (results[i].product_name == results[i - 1].product_name) {
      if (results[i].market_name === "PK") {
        document.querySelector(`th[data-id=pk${i - 1}]`).innerHTML =
          results[i].price;
      } else if (results[i].market_name === "Aeon") {
        document.querySelector(`th[data-id=aeon${i - 1}]`).innerHTML =
          results[i].price;
      } else {
        document.querySelector(`th[data-id=zstore${i - 1}]`).innerHTML =
          results[i].price;
      }
    }
  }
}

async function searchBeers() {
  let response = await fetch(`/searchBeers`);
  let results = await response.json();
  console.log("Search Beer results", results);
  let main = document.querySelector("tbody");
  if (results[0].market_name === "PK") {
    main.innerHTML = `<tr">
  <th class="product">${results[0].product_name}</th>
  <th class="brand">${results[0].brand_name}</th>
  <th class="pk">${results[0].price}</th>
    <th class="aeon">---</th>
    <th class="zstore">---</th>
    </tr>`;
  } else if (results[0].market_name === "Aeon") {
    main.innerHTML = `<tr">
  <th class="product">${results[0].product_name}</th>
  <th class="brand">${results[0].brand_name}</th>
  <th class="pk">---</th>
    <th class="aeon">${results[0].price}</th>
    <th class="zstore">---</th>
    </tr>`;
  } else if (results[0].market_name === "Zstore") {
    main.innerHTML = `<tr>
    <th class="product">${results[0].product_name}</th>
    <th class="brand">${results[0].brand_name}</th>
    <th class="pk">---</th>
    <th class="aeon">---</th>
    <th class="zstore">${results[0].price}</th>
    </tr>`;
  }

  for (let i = 1; i < results.length; i++) {
    if (results[i].product_name != results[i - 1].product_name) {
      if (results[i].market_name === "PK") {
        main.innerHTML += `<tr>
    <th class="product">${results[i].product_name}</th>
    <th class="brand">${results[i].brand_name}</th>
    <th class="pk" data-id=pk${i}>${results[i].price}</th>
      <th class="aeon" data-id=aeon${i}>---</th>
      <th class="zstore" data-id=zstore${i}>---</th>
      </tr>`;
      } else if (results[i].market_name === "Aeon") {
        main.innerHTML += `<tr>
    <th class="product">${results[i].product_name}</th>
    <th class="brand">${results[i].brand_name}</th>
    <th class="pk" data-id=pk${i}>---</th>
      <th class="aeon" data-id=aeon${i}>${results[i].price}</th>
      <th class="zstore" data-id=zstore${i}>---</th>
      </tr>`;
      } else if (results[i].market_name === "Zstore") {
        main.innerHTML += `<tr>
      <th class="product">${results[i].product_name}</th>
      <th class="brand">${results[i].brand_name}</th>
      <th class="pk" data-id=pk${i}>---</th>
      <th class="aeon" data-id=aeon${i}>---</th>
      <th class="zstore" data-id=zstore${i}>${results[i].price}</th>
      </tr>`;
      }
    } else if (
      results[i].product_name == results[i - 1].product_name &&
      results[i - 1].product_name == results[i - 2].product_name
    ) {
      if (results[i].market_name === "PK") {
        document.querySelector(`th[data-id=pk${i - 2}]`).innerHTML =
          results[i].price;
      } else if (results[i].market_name === "Aeon") {
        document.querySelector(`th[data-id=aeon${i - 2}]`).innerHTML =
          results[i].price;
      } else if (results[i].market_name === "Zstore") {
        document.querySelector(`th[data-id=zstore${i - 2}]`).innerHTML =
          results[i].price;
      }
    } else if (results[i].product_name == results[i - 1].product_name) {
      if (results[i].market_name === "PK") {
        document.querySelector(`th[data-id=pk${i - 1}]`).innerHTML =
          results[i].price;
      } else if (results[i].market_name === "Aeon") {
        document.querySelector(`th[data-id=aeon${i - 1}]`).innerHTML =
          results[i].price;
      } else {
        document.querySelector(`th[data-id=zstore${i - 1}]`).innerHTML =
          results[i].price;
      }
    }
  }
}

async function searchSnacks() {
  let response = await fetch(`/searchSnacks`);
  let results = await response.json();
  console.log("Search Snack results", results);
  let main = document.querySelector("tbody");
  if (results[0].market_name === "PK") {
    main.innerHTML = `<tr">
  <th class="product">${results[0].product_name}</th>
  <th class="brand">${results[0].brand_name}</th>
  <th class="pk">${results[0].price}</th>
    <th class="aeon">---</th>
    <th class="zstore">---</th>
    </tr>`;
  } else if (results[0].market_name === "Aeon") {
    main.innerHTML = `<tr">
  <th class="product">${results[0].product_name}</th>
  <th class="brand">${results[0].brand_name}</th>
  <th class="pk">---</th>
    <th class="aeon">${results[0].price}</th>
    <th class="zstore">---</th>
    </tr>`;
  } else if (results[0].market_name === "Zstore") {
    main.innerHTML = `<tr>
    <th class="product">${results[0].product_name}</th>
    <th class="brand">${results[0].brand_name}</th>
    <th class="pk">---</th>
    <th class="aeon">---</th>
    <th class="zstore">${results[0].price}</th>
    </tr>`;
  }

  for (let i = 1; i < results.length; i++) {
    console.log("result:",results[i]);
    console.log("i-2:",results[i - 2]);
    console.log("hello world")
    if (results[i].product_name != results[i - 1].product_name) {
      if (results[i].market_name === "PK") {
        main.innerHTML += `<tr>
    <th class="product">${results[i].product_name}</th>
    <th class="brand">${results[i].brand_name}</th>
    <th class="pk" data-id=pk${i}>${results[i].price}</th>
      <th class="aeon" data-id=aeon${i}>---</th>
      <th class="zstore" data-id=zstore${i}>---</th>
      </tr>`;
      } else if (results[i].market_name === "Aeon") {
        main.innerHTML += `<tr>
    <th class="product">${results[i].product_name}</th>
    <th class="brand">${results[i].brand_name}</th>
    <th class="pk" data-id=pk${i}>---</th>
      <th class="aeon" data-id=aeon${i}>${results[i].price}</th>
      <th class="zstore" data-id=zstore${i}>---</th>
      </tr>`;
      } else if (results[i].market_name === "Zstore") {
        main.innerHTML += `<tr>
      <th class="product">${results[i].product_name}</th>
      <th class="brand">${results[i].brand_name}</th>
      <th class="pk" data-id=pk${i}>---</th>
      <th class="aeon" data-id=aeon${i}>---</th>
      <th class="zstore" data-id=zstore${i}>${results[i].price}</th>
      </tr>`;
      }
    } else if (
      results[i].product_name == results[i - 1].product_name &&
      results[i - 1].product_name == results[i - 2].product_name
    ) {
      if (results[i].market_name === "PK") {
        document.querySelector(`th[data-id=pk${i - 2}]`).innerHTML =
          results[i].price;
      } else if (results[i].market_name === "Aeon") {
        document.querySelector(`th[data-id=aeon${i - 2}]`).innerHTML =
          results[i].price;
      } else if (results[i].market_name === "Zstore") {
        document.querySelector(`th[data-id=zstore${i - 2}]`).innerHTML =
          results[i].price;
      }
    } else if (results[i].product_name == results[i - 1].product_name) {
      if (results[i].market_name === "PK") {
        document.querySelector(`th[data-id=pk${i - 1}]`).innerHTML =
          results[i].price;
      } else if (results[i].market_name === "Aeon") {
        document.querySelector(`th[data-id=aeon${i - 1}]`).innerHTML =
          results[i].price;
      } else if (results[i].market_name === "Zstore") {
        document.querySelector(`th[data-id=zstore${i - 1}]`).innerHTML =
          results[i].price;
      } else {
        console.log(results[i])
      }
    }
  }
}

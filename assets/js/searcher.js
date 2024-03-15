let URLJSON = `https://raw.githubusercontent.com/Bootcamp-Espol/Datos/main/products.json`;
let URLXML = `https://raw.githubusercontent.com/Bootcamp-Espol/Datos/main/products.xml`;

let ubicacionProductosHTML = document.getElementById("templateProducts");
let textSearchHTML = document.getElementById("textSearch");
let button = document.getElementById("filter");
let allProductos;

/* Mostrar los objetos dado un arreglo en el html*/
let mostrarProducts = (arreglo) => {
  arreglo.forEach((element) => {
    let { name, price, src, type } = element;
    let template = `
    <div class="col-xl-3 col-md-6 mb-xl-0 mb-4 mt-4">
    <div class="card card-blog card-plain">
      <div class="card-header p-0 mt-n4 mx-3">
        <a class="d-block shadow-xl border-radius-xl">
          <img src="${src}" alt="${name}" class="img-fluid shadow border-radius-xl">
        </a>
      </div>
      <div class="card-body p-3">
        <p class="mb-0 text-sm">${type}</p>
        <a href="javascript:;">
          <h5>
            ${name}
          </h5>
        </a>
        <p class="mb-4 text-sm">
          <b>Price: </b> $ ${price}
        </p>
      </div>
    </div>
  </div>`;
    ubicacionProductosHTML.innerHTML += template;
  });
};

/* fetch de  todos los objetos en un arreglo (JSON Y XML)*/
async function fetchAlldata() {
  let fetchJsonData = await fetch(URLJSON).then((response) => response.json());
  let fetchXmlData = await fetch(URLXML)
    .then((response) => response.text())
    .then((str) => new window.DOMParser().parseFromString(str, "text/xml"))
    .then((data) => {
      let productsXML = Array.from(data.getElementsByTagName("product"));
      return productsXML.map((item) => {
        return {
          name: item.getElementsByTagName("name")[0].textContent,
          price: item.getElementsByTagName("price")[0].textContent,
          src: item.getElementsByTagName("src")[0].textContent,
          type: item.getElementsByTagName("type")[0].textContent,
        };
      });
    });
  let [jsonData, xmlData] = await Promise.all([fetchJsonData, fetchXmlData]);

  let combinedData = [...jsonData, ...xmlData];

  return combinedData;
}

/* devuelve un arreglo con los objetos filtrados por nombre o por semejanza */
function filterItemByNameAndWord(nameWord) {
  let nameWordLowerCase = nameWord.toLowerCase();
  const searchTermRegex = new RegExp(`\\b${nameWord}\\b`, "i");
  let arrayFiltered = allProductos.filter((element) => {
    let firstFilter = element.name.toLowerCase().includes(nameWordLowerCase);
    let secondFilter = searchTermRegex.test(element.name);

    return firstFilter || secondFilter;
  });

  return arrayFiltered;
}

/* Listener del buttom  */
button.addEventListener("click", (event) => {
  ubicacionProductosHTML.innerHTML = ``;
  let newArr = filterItemByNameAndWord(textSearchHTML.value);
  mostrarProducts(newArr);
});

/* validar que cuando esta vacio, el searcher muestre todo los objetos  */
textSearchHTML.addEventListener("input", function () {
  const inputValue = textSearchHTML.value;
  if (inputValue == "") {
    ubicacionProductosHTML.innerHTML = ``;
    mostrarProducts(allProductos);
  }
});

/* Cargar todos los objetos al iniciar */
fetchAlldata()
  .then((combinedData) => {
    allProductos = combinedData; /* Inicializo variable global */
    mostrarProducts(combinedData);
  })
  .catch((error) => {
    console.error("Error fetching or parsing data:", error);
  });

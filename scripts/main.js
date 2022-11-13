let productosJSON=[];
let dolarCompra;
let totalCarrito;
const cartasSection = document.getElementById("cartas");
const carritoSection = document.querySelector(`#carrito`)

let carrito = JSON.parse(localStorage.getItem("carritoAYL")) || [];
if(carrito.length != 0){
    cargarLocalStorage();
}
obtenerDolar();

let botonFinalizar = document.getElementById("finalizar");

const DateTime = luxon.DateTime;
const ahora = DateTime.now();

function cargarLocalStorage(){
  Swal.fire({
    imageUrl: `./images/logoN.png`,
    imageWidth: 250,
    imageHeight: 250,
    imageAlt: `logoA&LBlanco`,
    title: 'HOLA TU COMPRA AÚN TE ESTÁ ESPERANDO',
    text: 'Verifica El Carrito De Compras',
    width: 400,
    showConfirmButton: false,
    timer: 3000,
    background: `#57394a`,
    color: `#e0c2c0`,
    showClass: {
      popup: "animate__animated animate__flip",
    },
    hideClass: {
      popup: "animate__animated animate__backOutDown",
    },
    })
for(const producto of carrito){
      document.getElementById("tBody").innerHTML += `
      <tr>
      <td>${producto.nombre.toUpperCase()}</td>
      <td>$${producto.precio}</td>
      <td>${producto.cantidad}</td>
      <td><button id='btnBorrar${producto.id}' class="btn btn-ligth"><i class="fa-solid fa-trash-can"></i></button></td>
  </tr>
`;
let totalCarrito = carrito.reduce((acumulador, prod) => acumulador + prod.precio, 0);
  document.getElementById("totalPagar").innerText = `Total a pagar c/IVA incluido: $ ${totalCarrito * 1.21}`;
}
}
cargarCarrito();

//renderizar objetos a cartas
function cargarCartas() {
  for (const producto of productosJSON) {
    cartasSection.innerHTML += `
      <div class="card container-fluid col-sd-3">
        <img src="./images/${producto.imagen}.jpg" class="card-img-top" alt=${producto.imagen}>
        <div class="card-body">
          <h3 class="card-text">${producto.nombre.toUpperCase()}</h3>
          <p class="card-text">U$D ${(producto.precio/dolarCompra).toFixed(2)}</p>
          <button id='btnComprar${producto.id}' class="btn btn-ligth">Comprar</button>
        </div>
      </div>
    `;
  }
  //evento boton comprar
  productosJSON.forEach((producto) => {
    document
      .getElementById(`btnComprar${producto.id}`)
      .addEventListener("click", () => {
        agregarCarrito(producto);
      });
  });
}

//cotizacion dolar
function obtenerDolar(){
  const URLDOLAR = "https://api.bluelytics.com.ar/v2/latest";
  fetch(URLDOLAR)
      .then( respuesta => respuesta.json())
      .then( cotizaciones => {
          const dolarBlue = cotizaciones.blue;
          console.log(dolarBlue);
          document.getElementById("cotizacionDolar").innerHTML+=`
              <p>Dolar compra $${dolarBlue.value_buy} | Dolar venta $${dolarBlue.value_sell}</p>
          `;
          dolarCompra=dolarBlue.value_buy;
          obtenerJSON();
      })
      .catch(error => console.log("error"))
}

//GETJSON de productos.json
async function obtenerJSON() {
  const urlJSON="./mock/productos.json";
  const resp = await fetch(urlJSON);
  const data = await resp.json();
  productosJSON = data;
  //dolar y productos lanzo funcion
  cargarCartas();
}

//agregar cartas productos objetos al carrito 
const agregarCarrito = (productoComprar) => {
  let estaProducto = carrito.some(existe=>existe.id===productoComprar.id)
  Swal.fire({
    imageUrl: `./images/${productoComprar.imagen}.jpg`,
    imageWidth: 250,
    imageHeight: 250,
    imageAlt: productoComprar.nombre,
    title: productoComprar.nombre.toUpperCase(),
    text: "Se agregó al carrito",
    width: 400,
    showConfirmButton: false,
    timer: 1750,
    background: `#e0c2c0`,
    color: `#57394a`,
    showClass: {
      popup: "animate__animated animate__jackInTheBox",
    },
    hideClass: {
      popup: "animate__animated animate__backOutDown",
    },
  });
  if(estaProducto===false){
    carrito.push(productoComprar);
  }else{
    let productoComprarFind= carrito.find(productoComprarFind => productoComprarFind.id === productoComprar.id);
    productoComprarFind.cantidad++;
    productoComprarFind.precio = productoComprarFind.precio*productoComprarFind.cantidad;
  }
  cargarCarrito()
}

//renderizar en la tabla cartas productos objetos agregados al carrito
function cargarCarrito(){
  document.getElementById("tBody").innerHTML = ``;
  carrito.forEach((productoComprar)=>{
    document.getElementById("tBody").innerHTML += `
    <tr>
        <td>${productoComprar.nombre.toUpperCase()}</td>
        <td>$${productoComprar.precio}</td>
        <td>${productoComprar.cantidad}</td>
        <td><button id='btnBorrar${productoComprar.id}' class="btn btn-ligth"><i class="fa-solid fa-trash-can"></i></button></td>
    </tr>
  `;
    let totalCarrito = carrito.reduce((acumulador, prod) => acumulador + prod.precio, 0);
    document.getElementById("totalPagar").innerText = `Total a pagar c/IVA incluido: $ ${totalCarrito * 1.21}`;
    });
localStorage.setItem("carritoAYL",JSON.stringify(carrito));
borrarProducto();
}

//crear evento para cada boton borrar
function borrarProducto (){
  carrito.forEach((productoSacar) => {
  document
    .getElementById(`btnBorrar${productoSacar.id}`)
    .addEventListener("click", () => {
      carrito = carrito.filter(productoSacarFilter=>productoSacarFilter.id!==productoSacar.id);
          //Sweet alert
  Swal.fire({
    imageUrl: `./images/${productoSacar.imagen}.jpg`,
    imageWidth: 250,
    imageHeight: 250,
    imageAlt: productoSacar.nombre,
    title: productoSacar.nombre.toUpperCase(),
    text: "Se quitó del carrito",
    width: 400,
    showConfirmButton: false,
    timer: 1750,
    background: `#57394a`,
    color: `#e0c2c0`,
    showClass: {
      popup: "animate__animated animate__jackInTheBox",
    },
    hideClass: {
      popup: "animate__animated animate__backOutUp",
    },
  });
  if(carrito.length==0){
    document.getElementById("totalPagar").innerText = "";   
  }
  cargarCarrito();  
      });
  });
}

//finalizar boton compra
btnFinalCompra.onclick = () => {
  if(carrito.length==0){
    Swal.fire({
      imageUrl: `./images/logo.gif`,
      imageWidth: 250,
      imageHeight: 250,
      imageAlt: btnFinalCompra.nombre,
        title: 'LO SENTIMOS',
        text: 'Tu carro está vacío',
        showConfirmButton: false,
        timer: 2000,
        background: `#57394a`,
        color: `#e0c2c0`
      })
}else{
    carrito = [];
    document.getElementById("tBody").innerHTML = "";
    document.getElementById("totalPagar").innerText = "";
    localStorage.removeItem("carritoAYL");
    sessionStorage.clear();
    console.clear();
    //Sweet alert
    Swal.fire({
    imageUrl: `./images/logoB.png`,
    imageWidth: 250,
    imageHeight: 250,
    imageAlt: `logoA&LNegro`,
    title: `GRACIAS POR LA COMPRA!!!`,
    text: `Siempre a tu disposición`,
    width: 400,
    showConfirmButton: false,
    timer: 3000,
    background: `#e0c2c0`,
    color: `#57394a`,
    showClass: {
      popup: "animate__animated animate__flip",
    },
    hideClass: {
      popup: "animate__animated animate__backOutUp",
    },
  });
  //medir intevalo tiempo de compra
  const cierreDeCompra=DateTime.now();
  const Interval = luxon.Interval;
  const tiempo = Interval.fromDateTimes(ahora,cierreDeCompra);
  Toastify({
    // text: `Pronto recibirá un mail de confirmacion`,
    text: `Su tiempo fue de ${(tiempo.length('seconds')/60).toFixed(2)}' min.
    Pronto recibirá un mail de confirmación`,
    duration: 3000,
    gravity: 'top',
    position: 'right',
    style: {
        background: 'linear-gradient(to right, #57394a, #e0c2c0)'
    }
  }).showToast();

}
}
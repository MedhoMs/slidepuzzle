const inicio = new Date(); // Fecha y hora actual
let timer = document.getElementById('contador');

function actualizarContador() {
    const ahora = new Date(); // Fecha y hora actual
    const diferencia = ahora - inicio; // Diferencia en milisegundos
    const segundos = Math.floor(diferencia / 1000); // Convertimos a segundos
    display.textContent = segundos;
}

// Actualizamos cada 100 ms para que sea más preciso
setInterval(actualizarContador, 100);

let tds = document.querySelectorAll("td");


var imgList = ["<img draggable='false' src='img/tile1.png'>", "<img draggable='false' src='img/tile2.png'>", 
           "<img draggable='false' src='img/tile3.png'>", "<img draggable='false' src='img/tile4.png'>", 
           "<img draggable='false' src='img/tile5.png'>", "<img draggable='false' src='img/tile6.png'>", 
           "<img draggable='false' src='img/tile7.png'>", "<img draggable='false' src='img/tile8.png'>"];

//Con los ... puntos puedo crear un backup del array, sin los 3 puntos, solo estaria guardando un punto de referencia
var imgListBackup = [...imgList];

//Hago una variable constante del tamaño de la lista para que no me afecte al for
const imgListLength = imgList.length;

for (let i = 0; i < imgListLength; i++) {
    let imgListIndex = Math.floor(Math.random() * imgList.length);
    tds[i].innerHTML = imgList[imgListIndex];
    //Con el metodo splice puedo borrar la imagen que ya apareció para que no vuelva a salir
    imgList.splice(imgListIndex, 1);
}


let tileCoordinateList = [] //Array para guardar las coordenadas que asignare a cada td

for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 3; x++) {
        tileCoordinateList.push([y, x]);
    }
}

for (let i = 0; i < tds.length; i++) {
    tds[i].setAttribute('name', tileCoordinateList[i]) //Añado el atributo "name" a los td y le asigno las coordenadas en el name
}


///////////////////////////////////////////////////////
//---------APARTADO DE MOVER LAS CASILLAS------------//
///////////////////////////////////////////////////////

let dragElement = document.getElementsByTagName("td");

for (let i = 0; i < tds.length; i++) {
    dragElement[i].addEventListener("mousedown", dragEvent);
    dragElement[i].addEventListener("mouseup", releaseEvent);
}

var dragTileId = "";

//Uso currentTarget.id para extraer el id del target al cual se refiere la funcion, en este caso el <td>
//Si lo hiciera con target.id sin más, detectaria la imagen, supongo que por el bubbling.
function dragEvent(e) {
    dragTileId = e.currentTarget.id;
};

let moveCounter = 0 //Contador de movimientos

function releaseEvent(e) {
    let dropTile = document.getElementById(e.currentTarget.id); //Casilla donde suelto el click
    let draggedTile = document.getElementById(dragTileId); //Casilla que he arrastrado
    
    if (dropTile.getAttribute('title') == "empty") { //Si la casilla donde suelto el click su atributo "title" es = a empty

        //Saco las coordenadas de la casilla arrastrada y donde suelto, y las convierto en numeros
        let [dragCoordinateY, dragCoordinateX] = draggedTile.getAttribute('name').split(',').map(Number);
        let [dropCoordinateY, dropCoordinateX] = dropTile.getAttribute('name').split(',').map(Number);

        if ((dropCoordinateY === dragCoordinateY - 1 && dropCoordinateX === dragCoordinateX) || (dropCoordinateY === dragCoordinateY + 1 && dropCoordinateX === dragCoordinateX) || (dropCoordinateY === dragCoordinateY && dropCoordinateX === dragCoordinateX - 1) || (dropCoordinateY === dragCoordinateY && dropCoordinateX === dragCoordinateX + 1)) {
            draggedTile.setAttribute("title", "empty"); //A la casilla que arrastre le asigno un "title" empty

            //Y a la casilla donde solte, le quito el "title" empty, por que ahora actuará como una casilla jugable
            dropTile.removeAttribute("title");

            //LOGICA DE CAMBIO DE IMAGEN//
            let aux = dropTile.innerHTML;

            dropTile.innerHTML = draggedTile.innerHTML;

            draggedTile.innerHTML = aux;

            moveCounter++

            console.log(moveCounter);
            //LOGICA DE CAMBIO DE IMAGEN//

            //EXPLICACION DE LAS COORDENADAS//
            //Ejemplo: La casilla empty esta en 2,2. Si la casilla que arrastre no estaba en 
            //(menos 1y,misma x) o (misma y,menos 1x) o (misma y, mas 1x) o (mas 1y, misma x), 
            //esa casilla no esta a un lado del empty por lo tanto, no se moverá al empty

            //CODIGO MAS VISIBLE//
            //if((dropCoordinateY === dragCoordinateY - 1 && dropCoordinateX === dragCoordinateX) ||
            //(dropCoordinateY === dragCoordinateY + 1 && dropCoordinateX === dragCoordinateX) ||)
            //(dropCoordinateY === dragCoordinateY && dropCoordinateX === dragCoordinateX - 1) ||
            //(dropCoordinateY === dragCoordinateY && dropCoordinateX === dragCoordinateX + 1))
        }
    }

    //Llamo a la funcion que comprueba el puzzle cada vez que hago uso de la funcion release, es decir,
    //cada vez que suelto el click despues de seleccionar una casilla
    checkPuzzle(); 
}

///////////////////////////////////////////////////////
//---------APARTADO DE MOVER LAS CASILLAS------------//
///////////////////////////////////////////////////////

function checkPuzzle() {
    let imageCounter = 1;
    let imgCorrectOrder = [] //Creo un array para ir introduciendo las imagenes en el orden correcto, para despues verificarlo
    for (let i = 0; i < imgListBackup.length; i++) {
        let imgs = tds[i].querySelector("img"); //Obtengo de cada td su elemento img
        let imgSrc = imgs.getAttribute("src"); //Obtengo el atributo "src" de la img

        //Funcionamiento con mis palabras: Si el atributo "src" del elemento "img" del td posicion [i] es igual 
        //a la imagen {imageCounter}, esta bien
        if (imgSrc == `img/tile${imageCounter}.png`) {
            console.log(`Tile${imageCounter} correcto`);
            if (! imgCorrectOrder.includes(imgSrc)) { //Si el "src" que esta siendo comprobado, no esta en la lista, que lo introduzca
                imgCorrectOrder.push(imgSrc);
            }
            imageCounter++;
        } else {
            imageCounter++;
        }

    }

    let winText = document.getElementById("win-text");
    let winValidation = true;

    for (let i = 0; i < imgListBackup.length; i++) {
        //Si el primer "src" de la lista no es igual a la imagen i+1(aprovecho la i como contador simplemente sumandole 1 mas),
        //la validacion se suspende y sale del bucle
        if (imgCorrectOrder[i] !== `img/tile${i + 1}.png`) {
            winValidation = false;
            break;
        }
    }

    //En el caso de que la validacion sea correcta, aparecerá el mensaje ganador
    if (winValidation) {   
        winText.innerHTML = "Has ganado";
    }
}
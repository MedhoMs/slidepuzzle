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


//---------APARTADO DE MOVER LAS CASILLAS------------

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
    if (dragTileId != e.currentTarget.id) {
        let dropTile = document.getElementById(e.currentTarget.id);
        let draggedTile = document.getElementById(dragTileId);

        let aux = dropTile.innerHTML;

        dropTile.innerHTML = draggedTile.innerHTML;

        draggedTile.innerHTML = aux;

        moveCounter++

        console.log(moveCounter);

        console.log(`Se cambio el ${dragTileId} por el ${e.currentTarget.id}`);
    } else {
        console.log(`No se ha realizado ningun cambio de tiles`);
    }

    //Llamo a la funcion que comprueba el puzzle cada vez que hago uso de la funcion release, es decir,
    //cada vez que suelto el click despues de seleccionar una casilla
    checkPuzzle(); 
}

//---------APARTADO DE MOVER LAS CASILLAS------------


function checkPuzzle() {
    let imageCounter = 1;
    let imgCorrectOrder = [] //Creo un array para ir introduciendo las imagenes en el orden correcto, para despues verificarlo
    for (let i = 0; i < imgListBackup.length; i++) {
        let imgs = tds[i].querySelector("img"); //Obtengo de cada td su elemento img
        let imgSrc = imgs.getAttribute("src"); //Obtengo el atributo "src" de la img

        //Funcionamiento con mis palabras: Si el atributo "src" del elemento "img" del td posicion 0 es igual a la imagen "i", esta bien
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
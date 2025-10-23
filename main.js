let tds = document.querySelectorAll("td");

var imgList = ["<img draggable='false' src='img/tile1.png'>", "<img draggable='false' src='img/tile2.png'>", 
           "<img draggable='false' src='img/tile3.png'>", "<img draggable='false' src='img/tile4.png'>", 
           "<img draggable='false' src='img/tile5.png'>", "<img draggable='false' src='img/tile6.png'>", 
           "<img draggable='false' src='img/tile7.png'>", "<img draggable='false' src='img/tile8.png'>"];

for (let i = 0; i < imgList.length; i++) {
    tds[i].innerHTML = imgList[i];
}

//Una función para cargar y mostrar los records del localStorage
function loadRecords() {
    let allMoves = document.getElementById("all-moves");

    //Creo un array con localStorage que contendrá un array anidado con los detalles del ganador
    //JSON.parse convierte el string de localStorage a un array de JavaScript
    //Si no hay datos guardados, uso un array vacío como valor por defecto con ||
    const totalWinnersDetails = JSON.parse(localStorage.getItem("totalWinnersDetails")) || [];
    
    let records = "";
    for (let i = 0; i < totalWinnersDetails.length; i++) {
        records += `Partida ${i + 1}: Movimientos: ${totalWinnersDetails[i][0]}, Segundos: ${totalWinnersDetails[i][1]}<br><br>`;
    }
    
    allMoves.innerHTML = records;
}

//Llamo a la función cuando la página se carga para mostrar los records guardados, en caso de que haya
window.addEventListener('load', loadRecords);

//Con los ... puntos puedo crear un backup del array, sin los 3 puntos, solo estaria guardando un punto de referencia
var imgListBackup = [...imgList];

//Hago una variable constante del tamaño de la lista para que no me afecte al for
const imgListLength = imgList.length;

//Creo la funcion para el boton empezar
let start = document.getElementById("start");
start.addEventListener("click", startPuzzle);

let seconds = 0; //Hago la variable "seconds" de forma global para usarla mas adelante en otra funcion
let moveCounter = 0 //Contador de movimientos

//Cambio reciente: Muevo toda la logica dentro de la funcion para empezar el puzzle, ya que antes de hacer click en "Empezar"
//si haces click en cualquier parte del puzzle cuenta como que has ganado por que la funcion "release" llama a la funcion "checkPuzzle"
//y detecta que las piezas estan en orden y pues eso. Lo meto todo dentro de esta funcion y ya esta, no es necesario hacer validaciones

function startPuzzle() {
    for (let i = 0; i < imgListLength; i++) { //Junto con un for y con un Math random asigno las imagenes de forma aleatoria
        let imgListIndex = Math.floor(Math.random() * imgList.length);
        tds[i].innerHTML = imgList[imgListIndex];
        //Con el metodo splice puedo borrar la imagen que ya apareció para que no vuelva a salir
        imgList.splice(imgListIndex, 1);
    }
    start.setAttribute("hidden", true);
    
    const initial = new Date(); //Fecha y hora actual de cuando se pulsa el boton
    
    function updateTimer() {
        const now = new Date(); //Hago otra fecha y hora, ya que esta funcion se ira actualizando
        const diference = now - initial; //Resto la primera hora que es "estatica", con la que se va actualizando
        seconds = Math.floor(diference / 1000); //Convierto a segundos
    }
    
    //Cada 1000 milisegundos, se llama a la funcion para que la variable "ahora" se actualize,
    //y al restale la diferencia, se vayan sumando los numeros
    setInterval(updateTimer, 1000);


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
}

///////////////////////////////////////////////////////
//---------APARTADO DE MOVER LAS CASILLAS------------//
///////////////////////////////////////////////////////

function checkPuzzle() {
    let imageCounter = 1;
    let imgCorrectOrder = [] //Creo un array para ir introduciendo las imagenes en el orden correcto, para despues verificarlo
    for (let i = 0; i < imgListBackup.length; i++) {
        let imgs = tds[i].querySelector("img"); //Obtengo de cada td su elemento img

        if (!imgs) { //Control de error para cuando llegue a la tile 9, donde no hay imagen y ahí saltaba un error
            imageCounter++;
            continue;
        }

        let imgSrc = imgs.getAttribute("src"); //Obtengo el atributo "src" de la img

        //Funcionamiento: Si el atributo "src" del elemento "img" del td posicion [i] es igual 
        //a la imagen {imageCounter}, esta bien.
        if (imgSrc == `img/tile${imageCounter}.png`) {
            if (! imgCorrectOrder.includes(imgSrc)) { //Si el "src" que esta siendo comprobado, no esta en la lista, que lo introduzca
                imgCorrectOrder.push(imgSrc);
            }
            imageCounter++;
        } else {
            imageCounter++;
        }

    }

    let winners = document.getElementById("winners") //Apartado de ganadores
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

    //Vuelvo a declarar otra vez el mismo localStorage por que estan en funciones distintas, este permite guardar los datos
    //cuando se ha ganado, y el de la funcion "loadRecords" permite mostrar los records que ha guardado este ↓ localStorage
    //Si no hay datos guardados, uso un array vacío como valor por defecto con ||
    const totalWinnersDetails = JSON.parse(localStorage.getItem("totalWinnersDetails")) || [];

    //En el caso de que la validacion sea correcta, aparecerá el mensaje ganador
    if (winValidation) {   
        winText.innerHTML = "Has ganado";
        const winnerDetailsList = [moveCounter, seconds];
        totalWinnersDetails.push(winnerDetailsList);
        localStorage.setItem("totalWinnersDetails", JSON.stringify(totalWinnersDetails));

        for (let i = 0; i < tds.length; i++) {
            tds[i].style.pointerEvents = "none"; //Una vez haya ganado deshabilito las funciones de interacciones con los clicks
        }
    }
    
    loadRecords();
}


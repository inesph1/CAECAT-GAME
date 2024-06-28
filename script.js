"use strict"
window.onload = inicio;
let datosUsuario = { nombre: "", puntuacion: 0 }; //objeto datos usuario
let arrayUsuarios = localStorage.getItem('arrayUsuarios') ? JSON.parse(localStorage.getItem('arrayUsuarios')) : []; //obtiene el array guardado en local storage

function inicio() {
    let contador = 0; //variable global guarda el numero de las tiradas por partida
    let nombre = undefined; //variable global guarda el nombre del usuario jugando
    let ultimaImagen = ''; //variable global guarda la ultima casilla donde ha estado el heroe para reemplazarla cuando vuelva a moverse
    let nombreRecord = undefined; //variable global guarda el nombre de jugador del record
    let recordTiradas = undefined; //variable global guarda el record de tiradas 
    let continuar = false;
    divRegistro(); //ejecuta el formulario de registro


    function divRegistro() {

        //Hay que poner este fragmento de codigo aqui para que al si se termina la partida y se sigue jugando guarde correctamente las variables 
        let datosGuardados = arrayUsuarios;
        if (datosGuardados.length != 0) {
            datosGuardados.sort((a, b) => a.puntuacion - b.puntuacion); //ordena los datos guardados de menor a mayor (GANA quien menos tiradas haya hecho)
            nombreRecord = datosGuardados[0].nombre; //el record lo tiene el primer elemento de la lista ordenada de menor a mayor
            recordTiradas = datosGuardados[0].puntuacion;
        }


        //elimina el estilo cuando ya se ha ejecutado el juego una vez, como el css se añade en el scrript cambia la disposicion de los elementos original
        document.getElementsByTagName("body")[0].removeAttribute("style");

        document.getElementsByTagName("body")[0].innerHTML = ''; //elimina el contenido en caso de tener algo
        continuar = false;

        /*DIV 0 */
        let divInicial = document.createElement("div");
        let logo = document.createElement("img");
        let formulario = document.createElement("form");
        let etiqueta = document.createElement("label");
        let cuadroTexto = document.createElement("input");
        let btUsuario = document.createElement("button");
        let heroe = document.createElement("h1");
        let btPuntuaciones = document.createElement("button");
        let error = document.createElement("p");
        let lista = document.createElement("ul");


        logo.src = "./Dado/caecat.jpg";

        divInicial.id = "div0";
        logo.id = "logo";
        formulario.id = "formulario";
        etiqueta.id = "e1";
        cuadroTexto.id = "texto";
        btUsuario.id = "bt0";
        heroe.id = "heroe";
        btPuntuaciones.id = "btP";
        error.id = "er1";
        lista.id = "lU";

        btUsuario.type = "button"; //MUY IMPORTANTE SI NO POR DEFECTO ES SUBMIT
        btPuntuaciones.type = "button";

        etiqueta.innerHTML = "Introduce tu nombre";
        btUsuario.innerHTML = "Introducir nombre";
        btPuntuaciones.innerHTML = "Ranking";


        divInicial.appendChild(logo);
        formulario.appendChild(etiqueta);
        formulario.appendChild(cuadroTexto);
        formulario.appendChild(btUsuario);
        divInicial.appendChild(formulario);
        divInicial.appendChild(heroe);
        divInicial.appendChild(btPuntuaciones);
        divInicial.appendChild(error);
        divInicial.appendChild(lista);

        /* DIV 1 */
        /*BOTON JUGAR */
        let botonCrear = document.createElement("button");
        botonCrear.innerHTML = "Jugar";
        botonCrear.id = "bt1";
        botonCrear.disabled = true;

        let miDiv = document.createElement("div");
        miDiv.id = "div1";

        miDiv.appendChild(botonCrear);

        document.getElementsByTagName("body")[0].appendChild(divInicial);
        document.getElementsByTagName("body")[0].appendChild(miDiv);
        document.getElementsByTagName("body")[0].style.fontFamily = "Karla, sans-serif";

        btUsuario.addEventListener("click", comprobarValor);
        btPuntuaciones.addEventListener("click", verPuntuaciones);


        function verPuntuaciones() {
            document.getElementById("btP").disabled = true;

            let titulo = document.getElementById("tit");
            //console.log("TITULO EXISTE "+titulo);
            if (titulo != undefined) {
                document.getElementById("tit").parentNode.removeChild(titulo);
                //hay que usar el parentNode si no me daba error aunque no tendria por que
            }

            console.log("ENTRA EN VER PUNTUACIONES")

            //si ya se ha mostrado el rankin se eliminan los registros individuales pero no el ul
            if (document.getElementById("tit") === null || document.getElementById("tit").textContent.trim() === "") {
                let titulo = document.createElement("h2");
                titulo.id = "tit";
                titulo.innerHTML = "Ranking de mejores jugadas";
                document.getElementById("lU").appendChild(titulo);
            }

            if (datosGuardados.length != 0) {
                console.log("HAY DATOS");
                console.log(datosGuardados);

                //Añade los elementos del localstorage a una lista y los imprime
                for (let j = 0; j < datosGuardados.length; j++) {
                    let registro = document.createElement("li");
                    registro.innerHTML = "Nombre: " + datosGuardados[j].nombre + " Puntos: " + datosGuardados[j].puntuacion;
                    registro.style.listStyle = "none";
                    document.getElementById("lU").appendChild(registro);
                }

            }
            else {
                console.log("NO HAY DATOS");
                let registro = document.createElement("li");
                registro.style.listStyle = "none";
                registro.innerHTML = "No hay registros disponibles";
                document.getElementById("lU").appendChild(registro);

            }

        }

        function comprobarValor() {
            let formulario = document.getElementById("formulario");
            nombre = formulario.elements["texto"].value;

            let eliminar = Array.from(document.getElementsByTagName("li"));
            //al crear dinamicamente los elementos no los elimina bien hay que transofmarlo en array
            for (let i = 0; i < eliminar.length; i++) {
                // console.log("LISTA ELEMENTOS LI" + eliminar[i].innerText);
                eliminar[i].remove();
            }

            if (document.getElementById("tit") != undefined) {
                document.getElementById("tit").innerHTML = "";
            }

            let expRegular = /^[^0-9\s]+$/; //^dentro de los corchetes hace que NO contenga ningun numero de 0-9,\s sin espacios
            if (nombre != undefined && nombre != null && nombre != '' && nombre.length >= 4 && expRegular.test(nombre)) {
                //si se mete bien el nombre desaparece el error
                if (document.getElementById("er1") != undefined) {
                    document.getElementById("er1").remove();
                }
                /*los prompts detienen la ejecucion asi que se mete todo el codigo en una funcion anonima que se ejecutara despues de 10ms esto hará 
                que el mensaje er1 se elimine a tiempo  antes de que salga el prompt de que el nombre es correcto*/

                setTimeout(function () {
                    do {
                        let comprobacion = "aa";
                        if (nombre == undefined || nombre == null || nombre.length < 4 || !(expRegular.test(nombre))) {
                            comprobacion = prompt("No es posible jugar como " + nombre + ". Elige un nombre sin numeros y con mas de 4 caracteres");
                        }
                        else {
                            comprobacion = prompt("¿Quieres jugar como: " + nombre + " ?\nRecuerda que no podrás cambiar de usuario hasta pasarte el juego. Acepta, cancela o escribe tu nuevo nombre");
                        }
                        if (comprobacion == '') {
                            continuar = true;
                            console.log(continuar);
                            break;
                        }
                        else if (comprobacion == null) {
                            divRegistro();
                        }
                        else {
                            continuar = true;
                            nombre = comprobacion;
                        }
                    } while (nombre == undefined || nombre == null || nombre.length < 4 || !(expRegular.test(nombre)));

                    if (continuar) {
                        document.getElementById("btP").remove(); //borra el boton ranking
                        heroe.innerHTML = "Benvenido héroe " + nombre;
                        crearElementos();
                        botonCrear.disabled = false;

                        //ELIMINAR LISTA para que el boton de jugar suba arriba
                        document.getElementById("lU").remove();

                        btUsuario.disabled = true;
                        botonCrear.addEventListener("click", eventoCrear);

                        function crearElementos() {
                            /* DIV */
                            let miDiv2 = document.createElement("div");
                            miDiv2.id = "div2";
                            document.getElementsByTagName("body")[0].appendChild(miDiv);
                            document.getElementsByTagName("body")[0].appendChild(miDiv2);

                            //ESTILOS DIV1
                            //document.getElementById("div1").style.padding = "6vh";
                        }

                        function eventoCrear() {
                            if (document.getElementById("div0") != undefined) {
                                document.getElementById("div0").remove();
                            }

                            if (document.getElementsByTagName("table")[0] != undefined) {
                                let r;
                                if (document.getElementById("99").style.borderColor == "green") { //POSICION HEROE CAMBIAR

                                    //loggear usuario de nuevo para comenzar partida
                                    document.getElementById("div1").remove();
                                    document.getElementById("div2").remove();
                                    document.getElementById("div3").remove();
                                    divRegistro();
                                }
                                else {
                                    do {
                                        r = prompt('Si empiezas una nueva partida se borrará el progreso.\nSeguiras jugando como usuario ' + nombre + '\nEscribe o pulsa las siguientes teclas:\nAceptar/S ->Empezar de nuevo    Cancelar/N-> Seguir Jugando');
                                        if (r == '') {
                                            r = 's';
                                        }
                                        else if (r == null) {
                                            r = 'n';
                                        }
                                        r = r.toLowerCase()
                                    }
                                    while (r != 's' && r != 'n');
                                }


                                if (r == 's') {
                                    //elimina el contenido de la tabla y el div con la tirada y recuento
                                    ultimaImagen = "url('./Fondo/00.png')";
                                    document.getElementsByTagName("table")[0].style.removeProperty("borderColor");
                                    document.getElementsByTagName("table")[0].remove();
                                    document.getElementById("div3").remove();

                                    //reinicia contadores y dados
                                    contador = 0;

                                    //vuelve a activar el listener del boton en caso de que quedase desactivado al reiniciar la partida antes de elegir posicion
                                    document.getElementById("bt1").addEventListener("click", eventoCrear);

                                }

                            }
                            else {
                                //CREA Y GUARDA LA TABLA EN EL DIV2
                                document.getElementById("div2").appendChild(crearTabla(10, 10)); //retorna una tabla

                                //PROPIEDADES DEL DIV2 QUE CONTIENE LA TABLA
                                document.getElementById("div2").style.heigth = "30vh";
                                document.getElementById("div2").style.width = "100vh";

                                //PROPIEDADES DE LA TABLA: CENTRADO, BORDER COLLAPSE, TAMANIO
                                document.getElementsByTagName("table")[0].style.borderCollapse = "separate";
                                document.getElementsByTagName("table")[0].style.borderSpacing = "0";
                                document.getElementById("00").style.borderColor = "green";

                                document.getElementById("00").style.backgroundImage = "url('./guerrero/guerreroizquierda.png')";
                                document.getElementById("00").style.backgroundSize = "cover";

                                document.getElementsByTagName("table")[0].style.marginLeft = "8%";

                                document.getElementsByTagName("table")[0].style.width = "100%";
                                document.getElementsByTagName("table")[0].style.height = "100%";

                                let miDiv3 = document.createElement("div");
                                miDiv3.id = "div3";

                                //BOTON JUGAR
                                document.getElementById("bt1").style.width="100px";
                                document.getElementById("bt1").style.marginRight="8%";
                                document.getElementById("bt1").classList.add("quitarFondo");
                                


                                /*PARRAFO */
                                let parrafo = document.createElement("p");
                                parrafo.id = "p1";
                                parrafo.innerHTML = "Dado: ";

                                //DIV IMAGEN DADO
                                let divDado = document.createElement("div");
                                divDado.id = "divDado";
                                divDado.style.backgroundImage = "url('./Dado/1.png')";
                                divDado.style.width = "100px";
                                divDado.style.height = "100px";
                                divDado.style.backgroundSize = "cover";

                                //INFO TIRADAS Y USUARIO
                                let jugador = document.createElement("h1");
                                jugador.id = "j1";
                                jugador.innerHTML = nombre;

                                let contadorTiradas = document.createElement("p");
                                contadorTiradas.id = "p2";
                                contadorTiradas.innerHTML = "Número tirada: 1";

                                let record = document.createElement("p");
                                record.id = "p3";
                                if (nombreRecord == undefined) {
                                    record.innerHTML = "Aun no existe récord de tiradas. ¡Se el primero!";
                                } else {
                                    record.innerHTML = "Record: " + nombreRecord + " " + recordTiradas + " tiradas";
                                }


                                /*BOTON TIRAR DADO */
                                let botonJugar = document.createElement("button");
                                botonJugar.innerHTML = "Tirar dado";
                                botonJugar.id = "bt2";

                                miDiv3.appendChild(botonJugar);
                                miDiv3.appendChild(jugador);
                                miDiv3.appendChild(parrafo);
                                miDiv3.appendChild(divDado);
                                miDiv3.appendChild(contadorTiradas);
                                miDiv3.appendChild(record);

                                document.getElementsByTagName("body")[0].appendChild(miDiv3);
                                //document.getElementsByTagName("body")[0].style.alignItems = "center";
                                document.getElementsByTagName("body")[0].style.height = "90vh";
                                document.getElementsByTagName("body")[0].style.display = "flex";

                                //DIV3 ESTILOS
                                document.getElementById("div3").style.padding = "6vh";
                                document.getElementById("div3").style.marginLeft = "6vh";
                                botonJugar.addEventListener("click", eventoJugar);

                            }

                        }

                        function eventoJugar(event) {
                            //ESTILOS DIV1 y DIV3
                            console.log("ENTRA EN EVENTO TIRAR DADO");
                            event.target.removeEventListener("click", eventoJugar); //desactiva el boton para que no puedas hacer otra cosa que no sea tirar dado

                            if (contador == 0) {
                                ultimaImagen = "url('./Fondo/00.png')";
                            }


                            contador = contador + 1; //numero de tiradas
                            let random = Math.floor(Math.random() * (7 - 1) + 1); //muestra en el parrafo el numero
                            console.log("\nRANDOM " + random);
                            console.log("Tirada " + contador);
                            divDado.style.backgroundImage = `url('./Dado/${random}.png')`;
                            document.getElementById("p2").innerHTML = "Nº tirada: " + contador;
                            let posicionActual = posicionCeldas();


                            function posicionCeldas() {
                                let arrayCeldas = document.getElementsByTagName("td");
                                let celda = '';

                                for (let i = 0; i < arrayCeldas.length; i++) {
                                    //if (arrayCeldas[i].style.backgroundColor == 'red') {
                                    if (arrayCeldas[i].style.borderColor == 'green') { //CAMBIAR POSICION HEROE
                                        celda = arrayCeldas[i];
                                        break;
                                    }
                                }

                                return celda;
                            }


                            calculoPosicion(posicionActual, random); //llama a la funcion calcular posible movimientos pasando por parametro la posicion actual y la tirada del dado

                            function calculoPosicion(posicionActual, random) {
                                //console.log("HAS ENTRADO EN CALCULO");

                                posicionActual = posicionActual.id; //llega como String cuando se quiera operar como numero hay que parsearlo

                                //para compararlos con otros numeros hay que hacer un parseInt a cada posicion del String
                                let fila = parseInt(posicionActual.charAt(0));
                                let columna = parseInt(posicionActual.charAt(1));

                                //se convierte posicional actual en un int para hacer operaciones
                                posicionActual = parseInt(posicionActual);

                                //se summan y restan numeros pq posicionActual se ha pasado a int
                                let drch = posicionActual + random;
                                let izq = posicionActual - random;
                                let abajo = posicionActual + random * 10;
                                let arriba = posicionActual - random * 10;

                                //se guarda un array con todas las posiciones calculadas
                                let posiciones = [drch, izq, abajo, arriba];


                                //se recorre un bucle inverso porque al eliminar posiciones los indices saltan de uno a otro
                                for (let i = posiciones.length - 1; i >= 0; i--) {

                                    if (parseInt(posiciones[i]) < 0 || parseInt(posiciones[i]) >= 100) {
                                        //console.log("ELIMINA "+posiciones[i]);
                                        posiciones.splice(i, 1); //elimina el elemento de la posicion i, el 1 indica el numero de elementos
                                    }

                                    else if (posiciones[i] < 10) {
                                        posiciones[i] = "0" + posiciones[i];
                                        posiciones[i] = posiciones[i].toString();
                                    }

                                    if (parseInt(posiciones[i]) > 0 && posiciones[i].toString().charAt(0) != fila && posiciones[i].toString().charAt(1) != columna) {
                                        posiciones.splice(i, 1);
                                    }

                                    //para que una posicion avance en la columna debe cambiar el primer digito pero mantener el segundo
                                    //para que una posicion avance en la horizontal debe mantener el primer digito pero cambiar el segundo
                                    //si ambos digitos cambian la posicion no es posible y se elimina

                                }

                                let posicion = 0;

                                //si el array esta vacio no hay un movimiento posible activa de nuevo la tirada de dado
                                if (posiciones.length == 0) {
                                    document.getElementById("bt2").addEventListener("click", eventoJugar);
                                    alert("No puedes avanzar\nVuelve a tirar el dado");
                                }
                                else {

                                    for (let j = 0; j < posiciones.length; j++) {

                                        //console.log("POSICIONES ARRAY 2 "+ posiciones[j]);
                                        //si la posicion pasada a string es menor que 2 (fila, columna añade un cero)
                                        if (posiciones[j].toString().length < 2) {

                                            posicion = "0" + posiciones[j];
                                            //console.log("POSICION " + posicion);
                                            //console.log(document.getElementById(posicion));
                                            document.getElementById(posicion).style.borderColor = "red";
                                            document.getElementById(`${posicion}`).addEventListener("click", orejonCelda);
                                        }
                                        else {
                                            posicion = posiciones[j];
                                            //console.log("POSICION " + posicion);
                                            document.getElementById(`${posicion}`).style.borderColor = "red";
                                            document.getElementById(`${posicion}`).addEventListener("click", orejonCelda);

                                        }
                                    }
                                }

                                function orejonCelda(event) {

                                    let celdaPulsada = event.target;
                                    let a = parseInt(event.target.id);
                                    console.log("Has pulsado en la celda " + celdaPulsada.id);

                                    if (document.getElementsByTagName("td")[0] != undefined) {
                                        for (let i = 0; i < 100; i++) {

                                            if (document.getElementsByTagName("td")[i].style.borderColor === "green" || document.getElementsByTagName("td")[i].style.borderColor === "red") {
                                                if (document.getElementsByTagName("td")[i].style.borderColor === "green") {
                                                    document.getElementsByTagName("td")[i].style.backgroundImage = `${ultimaImagen}`;
                                                    document.getElementsByTagName("td")[i].style.backgroundSize = "cover";
                                                }

                                                document.getElementsByTagName("td")[i].style.borderColor = "black";
                                                document.getElementsByTagName("td")[i].removeEventListener("click", orejonCelda);
                                            }
                                        }
                                        //console.log(posicion);
                                    }
                                    ultimaImagen = celdaPulsada.style.backgroundImage;

                                    //DONDE COLOCAR EL GUERRERO SEGUN LA CELDA PULSADA QUE IMAGEN PULSAR
                                    if (parseInt(a) % 10 == 0) {
                                        celdaPulsada.style.backgroundImage = "url('./guerrero/guerreroizquierda.png')";
                                    }
                                    else if (parseInt(a) % 10 == 9) {
                                        celdaPulsada.style.backgroundImage = "url('./guerrero/guerreroderecha.png')";
                                    }
                                    else if (parseInt(a) >= 1 && parseInt(a) < 9) {
                                        celdaPulsada.style.backgroundImage = "url('./guerrero/guerreroarriba.png')";
                                    }
                                    else if (parseInt(a) >= 91 && parseInt(a) < 99) {
                                        celdaPulsada.style.backgroundImage = "url('./guerrero/guerreroabajo.png')";
                                    }
                                    else {
                                        celdaPulsada.style.backgroundImage = "url('./guerrero/guerrerof.png')";
                                    }

                                    celdaPulsada.style.backgroundSize = "cover";
                                    celdaPulsada.style.borderColor = "green";

                                    if (a == 99) {

                                        document.getElementById("99").style.backgroundImage = "url('./guerrero/guerreropremio.png')";
                                        document.getElementById("99").style.backgroundSize = "cover";
                                        let mensaje = "“Héroe, " + nombre + " has llegado al cofre en " + contador + " tiradas”";


                                        //GUARDADO DEL LOCALSTOAGE

                                        guardarUsuarios(nombre, contador);

                                        function guardarUsuarios(pNombre, pPuntuacion) {
                                            datosUsuario = { nombre: pNombre, puntuacion: pPuntuacion };//crea usuario
                                            arrayUsuarios = JSON.parse(localStorage.getItem('arrayUsuarios')) || [];
                                            if (!Array.isArray(arrayUsuarios)) { //si arrayUsuarios no es un array crea uno vacio
                                                arrayUsuarios = [];
                                            }

                                            arrayUsuarios.push(datosUsuario); //añade usuario al array
                                            localStorage.setItem('arrayUsuarios', JSON.stringify(arrayUsuarios));//almacena el array en el localstorage por orden de jugada
                                            //console.log(arrayUsuarios);
                                        }


                                        document.getElementById("bt2").disabled = true;
                                        if (contador < recordTiradas || recordTiradas == undefined) {
                                            mensaje = "¡“Héroe, " + nombre + " has establecido un récord de tiradas con " + contador + " tiradas”";
                                            recordTiradas = contador;
                                            nombreRecord = nombre;
                                            document.getElementById("p3").innerHTML = "Record: " + nombreRecord + " " + recordTiradas + " tiradas"; //actualiza en la pantalla final el record
                                        }
                                        contador = 0;
                                        alert(mensaje);
                                        botonCrear.innerHTML = "Volver a jugar";
                                        botonCrear.addEventListener("click", eventoCrear);
                                    }
                                    else {
                                        document.getElementById("bt2").addEventListener("click", eventoJugar); //vuelve a activar el listener del boton
                                    }
                                }
                            }
                            document.getElementById("p1").innerHTML = "Dado " + random;
                        }

                        function crearTabla(fila, columna) {
                            let tabla = document.createElement("table");
                            for (let i = 0; i < fila; i++) {
                                let fila = document.createElement("tr");
                                for (let j = 0; j < columna; j++) {
                                    let celda = document.createElement("td");
                                    celda.id = `${i}${j}`;
                                    celda.style.border = "4px solid black";

                                    if (`${i}` == 0) {
                                        celda.style.backgroundImage = "url('./Fondo/00.png')";
                                    }
                                    else if (`${j}` == 9 && `${i}` == 9) {
                                        celda.style.backgroundImage = "url('./guerrero/premiog.png')";
                                    }
                                    else if (`${i}${j}` == 42 || `${i}${j}` == 52 || `${i}${j}` == 44 || `${i}${j}` == 54 || `${i}${j}` == 45 || `${i}${j}` == 55 || `${i}${j}` == 47 || `${i}${j}` == 57 || (`${i}${j}` >= 12 && `${i}${j}` <= 17) || (`${i}${j}` >= 82 && `${i}${j}` <= 87)) {
                                        celda.style.backgroundImage = "url('./guerrero/guerreroflornaranja.png')";
                                    }
                                    else if (`${i}${j}` == 43 || `${i}${j}` == 53 || `${i}${j}` == 46 || `${i}${j}` == 56 || (`${i}${j}` >= 22 && `${i}${j}` <= 27) || (`${i}${j}` >= 72 && `${i}${j}` <= 77)) {
                                        celda.style.backgroundImage = "url('./guerrero/florrojag.png')";
                                    }
                                    else if (`${i}` == 9) {
                                        celda.style.backgroundImage = "url('./Fondo/abj.png')";
                                    }
                                    else if (`${j}` == 0) {
                                        celda.style.backgroundImage = "url('./Fondo/izq.png')";
                                    }
                                    else if (`${j}` == 9) {
                                        celda.style.backgroundImage = "url('./Fondo/der.png')";
                                    }
                                    else {
                                        celda.style.backgroundImage = "url('./Fondo/b.png')";
                                    }

                                    celda.style.backgroundSize = "cover";
                                    fila.appendChild(celda);
                                }
                                tabla.appendChild(fila);
                            }
                            return tabla; //devuelve un nodo tipo table
                        }
                    }
                }, 10);
            }

            //si no se cumple la comprobacion del nombre salta un error
            else {
                let error = document.getElementById("er1");
                error.innerHTML = "El nombre debe tener 4 o más letras y no debe contener numéricos";
                document.getElementById("er1").style.color = "red";
                //document.getElementById("div0").appendChild(error);
                document.getElementById("btP").disabled = false;
            }
        }
    }
}

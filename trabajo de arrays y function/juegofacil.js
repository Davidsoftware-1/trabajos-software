const prompt = require("prompt-sync")()

const opciones = ["piedra","papel","tijera"]

function eleccionComputadora(){
    let random = Math.floor(Math.random() * opciones.length)
    return opciones[random]
}

function determinarGanador(jugador, computadora){

    if(jugador === computadora){
        return "Empate"
    }

    switch(jugador){

        case "piedra":
            if(computadora === "tijera"){
                return "Ganaste"
            } else {
                return "Perdiste"
            }

        case "papel":
            if(computadora === "piedra"){
                return "Ganaste"
            } else {
                return "Perdiste"
            }

        case "tijera":
            if(computadora === "papel"){
                return "Ganaste"
            } else {
                return "Perdiste"
            }

        default:
            return "Opción inválida"
    }

}

function iniciarJuego(){

    let jugar = "si"

    while(jugar === "si"){

        let jugador = prompt("Elige piedra, papel o tijera: ").toLowerCase()

        let computadora = eleccionComputadora()

        console.log("La computadora eligió:", computadora)

        let resultado = determinarGanador(jugador, computadora)

        console.log(resultado)

        jugar = prompt("Quieres jugar otra vez? (si/no): ").toLowerCase()

    }

}

iniciarJuego()
const personajesElegibles = ["Mario", "Luigi", "Peach", "Yoshi", "Bowser"]
function elegirPersonaje(personaje) {
    if (personajesElegibles.includes(personaje)) {
        return personaje;
    } else {
        console.log("Personaje no elegible");
        return null;
    }
}
const personajeSeleccionado = elegirPersonaje ("mario");
console.log(personajeSeleccionado);
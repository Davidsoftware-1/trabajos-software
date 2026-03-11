const hamburguesa = "Doble"

function calcularPrecioCompra(tipoHamburguesa){

    let precio = 0

    if(tipoHamburguesa.toLowerCase() === "sencilla"){
        precio = 10000
    } 
    else if(tipoHamburguesa.toLowerCase() === "doble"){
        precio = 15000
    } 
    else if(tipoHambuesa.toLowerCase() === "triple"){
        precio = 20000
    } 
    else{
        console.log("Opción no válida")
    }

    return precio
}

let precioFinal = calcularPrecioCompra(hamburguesa)

console.log("El precio de la hamburguesa " + hamburguesa + " es: " + precioFinal)
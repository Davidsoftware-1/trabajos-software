let manzana = 1000
let banano = 500
let pera = 1200
function calcularPrecioFrutas(cantidadManzana, cantidadBanano, cantidadPera) {
    let totalManzana = cantidadManzana * manzana
    let totalBanano = cantidadBanano * banano
    let totalPera = cantidadPera * pera
    let precioTotal = totalManzana + totalBanano + totalPera
    return precioTotal
}
let precioFinal = calcularPrecioFrutas(3, 5, 2)
console.log("El precio total de las frutas es: " + precioFinal)
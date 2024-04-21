const fs = require('fs');

// Función para generar el ID del corredor
function generarId() {
    return Math.floor(Math.random() * 200) + 1;
}

// Función para generar la velocidad del corredor
function generarVelocidad() {
    return (Math.random() * (44 - 20) + 20).toFixed(2);
}

// Generar datos para el dataset
let datos = [];
for (let i = 0; i < 10000; i++) {
    datos.push({
        id: generarId(),
        speed: generarVelocidad()
    });
}

// Convertir datos a formato CSV
let csv = 'id,speed\n';
datos.forEach(row => {
    csv += `${row.id},${row.speed}\n`;
});

// Escribir datos en archivo CSV
fs.writeFileSync('dataset_corredores.csv', csv);

console.log("Dataset generado exitosamente.");
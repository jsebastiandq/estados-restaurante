const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

let pedidos = []

const estadosValidos = [
    "pendiente",
    "en preparación",
    "en camino",
    "entregado"
]


//Validamos que este funcionando!
app.get("/", (req,res) => {
    res.json({
        mensaje: "API de Pedidos funcionando correctamente"
    })
})

// Ver todos los pedidos - GET
app.get("/pedidos", (req, res) => {
    res.json(pedidos)
})

// Ver un pedido por ID - GET
app.get("/pedidos/:id", (req, res) => {
    const id = Number(req.params.id)
    const pedido = pedidos.find((p) => p.id === id)

    if(!pedido) {
        return res.status(404).json({
            mensaje: "Pedido no encontrado"
        })
    }

    res.json(pedido)
})

//Crear un pedido - POST
app.post("/pedidos", (req, res) => {
    const { cliente, productos } = req.body

    // Validando la informacion (Correcta)
    if (
        !cliente ||
        !productos ||
        !Array.isArray(productos) || 
        productos.length === 0
    ) {
        return res.status(400).json({
            mensaje: "Debes enviar correctamente clientes y productos (es un array)"
        })
    }

    const nuevoPedido = {
        id: Date.now(),
        cliente,
        productos,
        estado: "pendiente"
    }

    pedidos.push(nuevoPedido)

    res.status(200).json({
        mensaje: "Pedido creado correctamente",
        pedido: nuevoPedido
    })

})

// Actualizar un Pedido - PUT
app.put("/pedidos/:id", (req, res) => {
    const id = Number(req.params.id)
    const { cliente, productos, estado } = req.body
    const pedido = pedidos.find((p) => p.id === id)

    // Valida si el pedido existe
    if(!pedido){
        return res.status(404).json({
            mensaje: "Pedido no encontrado"
        })
    }

    // Valida que el estado sea el correcto 
    if (estado !== undefined && !estadosValidos.includes(estado)){
        return res.status(404).json({
            mensaje: "Estado invalido",
            estadosPermitidos: estadosValidos
        })
    }

    // Validar el cliente
    if(cliente !== undefined){
        pedido.cliente = cliente
    }

    // Validar el producto
    if(productos !== undefined){
        if(!Array.isArray(productos) || productos.length === 0) {
            return res.status(404).json({
                mensaje: "Producto debe ir en un Array"
            })
        }
        pedido.productos = productos
    }

    // Validar el estado 
    if(estado !== undefined){
        pedido.estado = estado
    }

    res.json({
        mensaje: "Pedido actualizado!",
        pedido
    })


})

// Eliminar un producto - DELETE
app.delete("/pedidos/:id", (req, res) => {
    const id = Number(req.params.id)
    const existePedido = pedidos.some((p) => p.id === id)

    if(!existePedido){
        return res.status(404).json({
            mensaje: "Pedido no encontrado"
        })
    }

    pedidos = pedidos.filter(p => p.id !== id)

    res.json({
        mensaje: "Eliminado correctamente"
    })
} )

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
})
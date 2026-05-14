const API_URL = "http://localhost:3000/pedidos"

const formPedido = document.getElementById("formPedido")
const inputCliente = document.getElementById("cliente")
const inputProductos = document.getElementById("productos")
const listaPedidos = document.getElementById("listaPedidos")
const filtrarEstados = document.getElementById("filtroEstado")

let pedidosGuardados = []

async function obtenerPedido() {
    try {
        const respuesta = await fetch(API_URL)
        const pedidos = await respuesta.json()

        pedidosGuardados = pedidos
        pintarPedido(pedidos)

    } catch (error) {
        console.error("Error al obtener pedidos: ", error)
        listaPedidos.innerHTML = 
        `<p class="mensaje-vacio">No se pudieron cargar los pedidos</p>`
    }
}

function pintarPedido(pedidos){
    listaPedidos.innerHTML = ""

    if(pedidos.length === 0){
        listaPedidos.innerHTML = 
        `<p class="mensaje-vacio">No hay pedidos para mostrar</p>`
        return
    }

    pedidos.forEach((pedido) => {
        const div = document.createElement("div")
        div.classList.add("pedido")

        div.innerHTML = `
        <h3>Pedido #${pedido.id}</h3>
        <p><b>Cliente: </b> ${pedido.cliente}</p>
        <p><b>Productos: </b> ${pedido.productos.join(", ")}</p>
        <p><b>Estado: </b> <span class="estado">${pedido.estado}</span></p>
        
        <div class="acciones">
            <select onchange="cambiarEstado(${pedido.id}, this.value)">
            <option value="pendiente" ${pedido.estado === "pendiente" ? "select" : ""}>Pendiente</option>
            <option value="en preparación" ${pedido.estado === "en preparación" ? "select" : ""}>En preparación</option>
            <option value="en camino" ${pedido.estado === "en camino" ? "select" : ""}>En camino</option>
            <option value="entregado" ${pedido.estado === "entregado" ? "select" : ""}>Entregado</option>
            </select>
        </div>

            <button class="btn-eliminar" onclick="eliminarPedido(${pedido.id})">
            Eliminar</button>
        </div>
        `
        
        listaPedidos.appendChild(div)
    })
}

formPedido.addEventListener("submit", async(e) => {
    e.preventDefault();

     const cliente = inputCliente.value.trim()
     const productos = inputProductos.value
        .split(",")
        .map((producto) => producto.trim())
        .filter((producto) => producto !== "")

    if(!cliente || productos.length === 0){
        alert("Debes ingresar el cliente y al menos un producto")
        return
    }

    const nuevoPedido = {
        cliente,
        productos
    }

    try {
        await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(nuevoPedido)
        })
        formPedido.reset()
        obtenerPedido()
    } catch (error) {
        console.error("Error al crear un pedido: ", error)
        alert("No se pudo crear el pedido")
    }
})

async function eliminarPedido(id) {
    const confirmar = confirm("¿Seguro que lo quiere eliminar?")

    if(!confirmar) return

    try {
        await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        })

        obtenerPedido()
    } catch (error) {
        console.error("Error al eliminar el pedido: ", error)
        alert("No se pudo eliminar el pedido")
    }
}

async function cambiarEstado(id, estado) {
    try {
        await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({estado})
        })
        obtenerPedido()
    } catch (error) {
        console.error("Error al cambiar estado: ", error)
        alert("No se pudo cambiar el estado")
    }
}

obtenerPedido()
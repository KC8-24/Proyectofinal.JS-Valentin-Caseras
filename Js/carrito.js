// Simulando una API para obtener productos
function fetchProducts() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { id: 1, name: "Producto 1", price: 800 },
                { id: 2, name: "Producto 2", price: 1000 },
                { id: 3, name: "Producto 3", price: 900 }
            ]);
        }, 1000);
    });
}

// Simulando una API para realizar la compra
function processPurchase(cart) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (cart.length > 0) {
                resolve("Compra realizada con éxito");
            } else {
                reject("El carrito está vacío");
            }
        }, 1000);
    });
}

// Manejo del DOM y Storage
document.addEventListener("DOMContentLoaded", async () => {
    const productsContainer = document.getElementById("products");
    const cartItemsContainer = document.getElementById("cart-items");
    const totalContainer = document.getElementById("total");
    const messageContainer = document.getElementById("message");
    const buyButton = document.getElementById("buy-button");
    const clearButton = document.getElementById("clear-button");

    let products = [];
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    try {
        products = await fetchProducts();
    } catch (error) {
        console.error("Error al obtener los productos:", error);
    }

    function renderProducts() {
        productsContainer.innerHTML = "";
        products.forEach(product => {
            const productDiv = document.createElement("div");
            productDiv.className = "product";
            productDiv.innerHTML = `
                <span>${product.name} - $${product.price.toFixed(2)}</span>
                <button onclick="addToCart(${product.id})">Añadir al carrito</button>
            `;
            productsContainer.appendChild(productDiv);
        });
    }

    function renderCart() {
        cartItemsContainer.innerHTML = "";
        cart.forEach(item => {
            const cartItemDiv = document.createElement("div");
            cartItemDiv.className = "cart-item";
            cartItemDiv.innerHTML = `
                <span>${item.name} - $${item.price.toFixed(2)} x ${item.quantity}</span>
                <button onclick="removeFromCart(${item.id})">Eliminar</button>
            `;
            cartItemsContainer.appendChild(cartItemDiv);
        });
        renderTotal();
    }

    function renderTotal() {
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        totalContainer.innerText = `Total: $${total.toFixed(2)}`;
    }

    window.addToCart = function (id) {
        const product = products.find(p => p.id === id);
        const cartItem = cart.find(item => item.id === id);

        if (cartItem) {
            cartItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
    };

    window.removeFromCart = function (id) {
        const cartItem = cart.find(item => item.id === id);

        if (cartItem) {
            if (cartItem.quantity > 1) {
                cartItem.quantity -= 1;
            } else {
                cart = cart.filter(item => item.id !== id);
            }
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
    };

    buyButton.addEventListener("click", async () => {
        try {
            const message = await processPurchase(cart);
            cart = [];
            localStorage.setItem("cart", JSON.stringify(cart));
            renderCart();
            messageContainer.innerText = "";
            Swal.fire({
                icon: 'success',
                title: 'Compra realizada con éxito',
                text: message
            });
        } catch (error) {
            messageContainer.innerText = error;
        }
    });

    clearButton.addEventListener("click", () => {
        cart = [];
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
    });

    renderProducts();
    renderCart();
});
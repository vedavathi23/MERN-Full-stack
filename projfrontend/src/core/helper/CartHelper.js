const { API } = require("../../backend");

// Method that helps to add the product to cart 

export const addItemToCart = (item, next) => {
    let cart = [];
    if (typeof window !== undefined) {
        if (localStorage.getItem("cart")) {
            cart = JSON.parse(localStorage.getItem("cart"));
        }
        cart.push({
            ...item,
            count: 1
        });
        localStorage.setItem("cart", JSON.stringify(cart));
        next();
    }
}

// Method that loads the products in cart page

export const loadCart = () => {
    if (typeof window !== undefined) {
        if (localStorage.getItem("cart")) {
            return JSON.parse(localStorage.getItem("cart"))
        }
    }
}

// Method that removes the product from cart page

export const removeItemFromCart = productId => {
    let cart = [];
    if (typeof window !== undefined) {
        if (localStorage.getItem("cart")) {
            cart = JSON.parse(localStorage.getItem("cart"))
        }
        cart.map((product, index) => {
            if (product._id === productId) {
                cart.splice(index, 1);
            }
        });
        localStorage.setItem("cart", JSON.stringify(cart))
    }
    return cart;
}

// Method to empty cart after placing the order

export const emptyCart = next => {
    if(typeof window !== undefined){
        localStorage.removeItem("cart")
        let cart = [];
        localStorage.setItem("cart", JSON.stringify(cart));
        next();
    }
};
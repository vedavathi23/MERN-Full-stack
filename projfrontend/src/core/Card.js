import React, { useState, useEffect } from 'react'
import ImageHelper from './helper/ImageHelper';
import { Redirect } from 'react-router-dom';
import { addItemToCart, removeItemFromCart } from './helper/CartHelper';


const Card = ({
    product,
    addToCart = true,
    removeFromCart = false,
    setReload = f => f,
    // function(f){return f} 
    reload = undefined
}) => {

    const [redirect, setRedirect] = useState(false)
    const [count, setCount] = useState(product.count)

    // Defining variables to load product title, description and price

    const cardTitle = product ? product.name : "A photo from pexels"
    const cardDescription = product ? product.description : "This photo from pexel looks great"
    const cardPrice = product ? product.price : "DEFAULT"

    // Method that redirects the user to cart page

    const getRedirect = (redirect) => {
        if (redirect) {
            return <Redirect to="/cart" />
        }
    }

    // Method that adds the product to cart

    const addProductToCart = () => {
        addItemToCart(product, () => setRedirect(true));
    }

    // Conditional rendering for Adding the product to cart

    const showAddToCart = addToCart => {
        return (
            addToCart && (
                <button
                    onClick={addProductToCart}
                    className="btn btn-block btn-outline-success mt-2 mb-2"
                >
                    Add to Cart
                </button>
            )
        );
    };

    // Conditional rendering for removing the product from cart

    const showremoveFromCart = removeFromCart => {
        return (
            removeFromCart && (
                <button
                    onClick={() => {
                        removeItemFromCart(product._id);
                        setReload(!reload);
                    }}
                    className="btn btn-block btn-outline-danger mt-2 mb-2"
                >
                    Remove from cart
                </button>
            )
        );
    };

    return (
        <div className="card text-white bg-dark border border-info ">
            <div className="card-header lead">{cardTitle}</div>
            <div className="card-body">
                {getRedirect(redirect)}
                <ImageHelper product={product} />
                <p className="lead bg-success font-weight-normal text-wrap">{cardDescription}</p>
                <p className="btn btn-success rounded  btn-sm px-4">$ {cardPrice}</p>
                <div className="row">
                    <div className="col-12">
                        {showAddToCart(addToCart)}
                    </div>
                    <div className="col-12">
                        {showremoveFromCart(removeFromCart)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Card;
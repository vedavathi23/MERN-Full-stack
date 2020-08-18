import React, { useState, useEffect } from 'react'
import '../styles.css'
import { API } from '../backend'
import Base from './Base'
import Card from './Card'
import { Link } from 'react-router-dom';
import { loadCart } from './helper/CartHelper'
import StripeCheckout from './StripeCheckout'
import PaypalPayment from './PaypalPayment'


const Cart = () => {

    const [products, setProducts] = useState([]);
    const [reload, setReload] = useState(false)

    // Helps to load all the products in cart page

    useEffect(() => {
        setProducts(loadCart())
    }, [reload])

    // Method that renders the data in cart component

    const loadAllProducts = products => {
        console.log("-------------------------", Object.keys(products).length)
        return (
            <div>
                <h1>Cart</h1>
                {products.map((product, index) => {
                    return (
                        <Card
                            key={index}
                            product={product}
                            addToCart={false}
                            removeFromCart={true}
                            setReload={setReload}
                            reload={reload}
                        />
                    )
                })}
            </div>
        )
    }

    // Method that renders the data in checkout component

    const loadCheckout = () => {
        return (
            <div>
                <h1>This section is to load checkout</h1>
            </div>
        )
    }

    return (
        <Base title="Home Page" description="Welcome to the T-shirt Store">
            <div className="row text-center">
                <div className="col-6">
                    {/* {loadAllProducts(products)} */}
                    {Object.keys(products).length > 0 ? (
                        loadAllProducts(products)
                    ) : (
                            <h3> Your cart is empty. Please add products.</h3>
                        )}
                </div>
                <div className="col-6">
                    {/* {loadCheckout()} */}
                    <PaypalPayment
                        products={products}
                        setReload={setReload}
                    />
                    <StripeCheckout
                        products={products}
                        setReload={setReload}
                    />
                </div>
            </div>
        </Base>
    )
}

export default Cart;

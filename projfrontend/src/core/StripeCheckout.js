import React, { useState, useEffect, Component } from 'react';
import { isAuthenticated } from '../auth/helper';
import { loadCart, emptyCart } from './helper/CartHelper';
import { Link } from 'react-router-dom';
import StripeCheckoutButton from 'react-stripe-checkout';
import { API } from '../backend';
import {createOrder} from './helper/OrderHelper'

const StripeCheckout = ({
    products,
    setReload = f => f,
    reload = undefined
}) => {

    const [data, setData] = useState({
        loading: false,
        success: false,
        error: "",
        address: ""
    })

    const token = isAuthenticated() && isAuthenticated().token
    const userId = isAuthenticated() && isAuthenticated().user._id

    // Method to calculate the final price of cart

    const getFinalPrice = () => {
        let amount = 0;
        products.map(product => {
            amount = amount + product.price
        });
        return amount;
    }

    //Method to make payment

    const makePayment = (token) => {
        const body = {
            token,
            products
        }
        const headers = {
            "Content-Type": "application/json"
        }
        return fetch(`${API}/stripepayment`, {
            method: "POST",
            headers,
            body: JSON.stringify(body)
        }).then(response => {
            console.log("RESPONSE", response);
            //call further methods
            const { status } = response;
            console.log("STATUS", status);
            const orderData = {
                products: products,
                transaction_id: response.transaction._id,
                amount: response.transaction.amount
            };
            createOrder(userId, token, orderData)
        }).catch(error => console.log(error));
    }

    // Method to show the pay with stripe button

    const showStripeBtn = () => {
        return isAuthenticated() ? (
            <StripeCheckoutButton
                stripeKey="pk_test_51HH8odJn6U0QtUXEq2xgs2JJVSM2Z2NnDuZwqNkvFYQbrNIVSrmc4DeyHMdG0VpqqqAs5sUW5xWvg0w0OzuWQU1700ej79II9P"
                token={makePayment}
                amount={getFinalPrice() * 100}
                name="Buy T-shirts"
                shippingAddress
                billingAddress
            >
                <button className="btn btn-success">Pay with stripe</button>
            </StripeCheckoutButton>
        ) : (
                <Link to="/signin">
                    <button className="btn btn-warning">Signin</button>
                </Link>
            )
    }

    return (
        <div>
            <h3 className="text-white text-left mt-5">Stripe Check out</h3>
            <h3 className="text-left">Total payable amount is {getFinalPrice()}</h3>
            {showStripeBtn()}
        </div>
    )
}

export default StripeCheckout;
import React, { useState, useEffect } from 'react'
import { loadCart, emptyCart } from './helper/CartHelper';
import { Link } from 'react-router-dom';
import { getMeToken, processPayment } from './helper/PaymentHelper';
import {createOrder} from './helper/OrderHelper'
import { isAuthenticated } from '../auth/helper';
import DropIn from 'braintree-web-drop-in-react';


const PaypalPayment = ({
    products,
    setReload = f => f,
    reload = undefined
}) => {

    const [info, setInfo] = useState({
        loading: false,
        success: false,
        clientToken: null,
        error: ""
    })

    const userId = isAuthenticated() && isAuthenticated().user._id
    const token = isAuthenticated() && isAuthenticated().token

    const getToken = (userId, token) => {
        getMeToken(userId, token).then(info => {
            console.log("INFORMATION", info)
            if (info.error) {
                setInfo({ ...info, error: info.error })
            } else {
                const clientToken = info.clientToken
                setInfo({ clientToken })
            }
        })
    }

    const showBTDropIn = () => {
        return (
            <div>
                {info.clientToken !== null && Object.keys(products).length > 0 ? (
                    <div>
                        <DropIn
                            options={{ authorization: info.clientToken }}
                            onInstance={instance => (info.instance = instance)}
                        />
                        <button className="btn btn-block btn-outline-success" onClick={onPurchase}>Buy with Paypal</button>
                    </div>
                ) : (<h3>Please Login Here or Add something to cart</h3>)}
            </div>
        )
    }


    useEffect(() => {
        getToken(userId, token)
    }, [])

    const onPurchase = () => {
        setInfo({ loading: true })
        let nonce;
        let getNonce = info.instance
            .requestPaymentMethod()
            .then(data => {
                nonce = data.nonce
                const paymentData = {
                    paymentMethodNonce: nonce,
                    amount: getAmount()
                };
                processPayment(userId, token, paymentData)
                    .then(response => {
                        setInfo({ ...info, success: response.success, loading: false });
                        const orderData = {
                            products: products,
                            transaction_id: response.transaction._id,
                            amount: response.transaction.amount
                        };
                        createOrder(userId, token, orderData)
                        console.log("PAYMENT SUCCESS")
                        emptyCart(() => {
                            console.log("Did we got a crash?")
                        });
                        setReload(!reload);
                    })
                    .catch(error => {
                        setInfo({ loading: false, success: false })
                        console.log("PAYMENT FAILED")
                    })
            })
    }

    const getAmount = () => {
        let amount = 0;
        products.map(product => {
            amount = amount + product.price
        })
        return amount
    }

    return (
        <div>
            <h3 className="text-left">Paypal Payment</h3>
            <h3 className="text-left">Total payable amount is {getAmount()}</h3>
            {showBTDropIn()}
        </div>
    )
}


export default PaypalPayment;
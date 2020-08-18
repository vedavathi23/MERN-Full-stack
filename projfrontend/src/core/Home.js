import React, { useState, useEffect } from 'react'
import '../styles.css'
import { API } from '../backend'
import Base from './Base'
import Card from './Card'
import { getAllProducts } from './helper/coreapicalls'

export default function Home() {

    const [products, setProducts] = useState([])
    const [error, setError] = useState(false)

    // Method that loads all the available products from database

    const loadAllProducts = () => {
        getAllProducts().then(data => {
            if(data?.error){
                setError(data.error)
            } else {
                setProducts(data)
            }
        });
    };

    useEffect(() => {
       loadAllProducts()
    }, [])

    return (
        <Base title="Home Page" description = "Welcome to the T-shirt Store">
            <div className="row text-center">
                <h1 className="text-white">Showing all the T-shirts</h1>
                <div className="row">
                    {products.map((product, index) => {
                        return(
                        <div className="col-4 mb-2" key={index}>
                            <Card product={product} />
                        </div>
                        )
                    })}
                </div>
            </div>
        </Base>
    )
}

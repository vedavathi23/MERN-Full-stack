import React, { useState, useEffect } from 'react'
import Base from '../core/Base';
import { Link, Redirect } from 'react-router-dom';
import { getCategories, getProduct, updateProduct } from './helper/adminapicall'
import { isAuthenticated } from '../auth/helper';

const UpdateProduct = ({ match }) => {

    const { user, token } = isAuthenticated();

    // Defining the state

    const [values, setValues] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        categories: [],
        category: "",
        loading: false,
        error: "",
        getRedirect: false,
        createdProduct: "",
        formData: ""
    });

    // Destructuring the product values

    const { name, description, price, stock, categories, category, loading, error, getRedirect, createdProduct, formData } = values;

    // Preloads all the categories when admin goes to create product page

    const preload = productId => {
        getProduct(productId).then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error })
            } else {
                preloadCategories();
                setValues({
                    ...values,
                    name: data.name,
                    description: data.description,
                    price: data.price,
                    category: data.category._id,
                    stock: data.stock,
                    formData: new FormData()
                })
            }
        })
    };

    useEffect(() => {
        preload(match.params.productId);
    }, [])

    // Preloads all theavailable categories

    const preloadCategories = () => {
        getCategories().then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error })
            } else {
                setValues({
                    categories: data,
                    formData: new FormData()
                })
                console.log(categories);
            }
        })
    }

    // Handling change

    const handleChange = name => event => {
        const value = name === "photo" ? event.target.files[0] : event.target.value
        formData.set(name, value);
        setValues({ ...values, [name]: value })
    };

    // Handling Submit button

    const onSubmit = (event) => {
        event.preventDefault();
        setValues({ ...values, error: "", loading: true })
        updateProduct(match.params.productId, user._id, token, formData).then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error })
            } else {
                setValues({
                    ...values,
                    name: "",
                    description: "",
                    price: "",
                    photo: "",
                    stock: "",
                    loading: false,
                    getRedirect: true,
                    createdProduct: data.name
                })
            }
        })
    };

    // Success Message

    const successMessage = () => {
        return (
            <div className="alert alert-success mt-3" style={{ display: createdProduct ? "" : "none" }}>
                <h4>{createdProduct} Updated successfully</h4>
            </div>
        )
    }

    // Error Message

    const errorMessage = () => {
        if (error) {
            return <h4 className="text-danger py-3">Failed to update product</h4>
        }
    }

    // This method tells us redirects to admin home page after product creation

    const performRedirect = () => {
        if (getRedirect) {
            return <Redirect to="/admin/dashboard" delay={5000} />;
        }
    };

    // Form 

    const createProductForm = () => (
        <form>
            <span>Upload photo</span>
            <div className="form-group">
                <label className="btn btn-block btn-success">
                    <input
                        onChange={handleChange("photo")}
                        type="file"
                        name="photo"
                        accept="image"
                        placeholder="choose a file"
                    />
                </label>
            </div>
            <div className="form-group">
                <input
                    onChange={handleChange("name")}
                    name="photo"
                    className="form-control"
                    placeholder="Name"
                    value={name}
                />
            </div>
            <div className="form-group">
                <textarea
                    onChange={handleChange("description")}
                    name="photo"
                    className="form-control"
                    placeholder="Description"
                    value={description}
                />
            </div>
            <div className="form-group">
                <input
                    onChange={handleChange("price")}
                    type="number"
                    className="form-control"
                    placeholder="Price"
                    value={price}
                />
            </div>
            <div className="form-group">
                <select
                    onChange={handleChange("category")}
                    className="form-control"
                    placeholder="Category"
                >
                    <option>Select</option>
                    {categories && categories.map((category, index) => (
                        <option key={index} value={category._id}>{category.name}</option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <input
                    onChange={handleChange("stock")}
                    type="number"
                    className="form-control"
                    placeholder="Stock"
                    value={stock}
                />
            </div>
            <button
                type="submit"
                onClick={onSubmit}
                className="btn btn-outline-success mb-3"
            >
                Update Product
          </button>
        </form>
    );

    return (
        <Base title="Update a product here!" description="Welcome to product update section" className="container bg-info p-4">
            <Link to="/admin/dashboard" className="btn btn-md btn-dark mb-3">Admin Home</Link>
            <div className="row bg-dark text-white rounded">
                <div className="col-md-8 offset-md-2">
                    {successMessage()}
                    {errorMessage()}
                    {createProductForm()}
                    {performRedirect()}
                </div>
            </div>
        </Base>
    )
}

export default UpdateProduct;
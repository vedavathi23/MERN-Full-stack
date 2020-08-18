import React, { useState, useEffect } from 'react'
import Base from '../core/Base';
import { isAuthenticated } from '../auth/helper';
import { Link } from 'react-router-dom';
import { getCategory, updateCategory } from './helper/adminapicall';

const UpdateCategory = ({ match }) => {

    // Defining states for name, error and success messages

    const [name, setName] = useState("")
    const [error, setError] = useState(false)
    const [success, setSuccess] = useState(false)

    // Destructuring the user details

    const { user, token } = isAuthenticated();

    // Method that navigates to admin home page

    const goBack = () => {
        return (
            <div className="mt-5">
                <Link className="btn btn-sm btn-success mb-3" to="/admin/dashboard">Admin Home</Link>
            </div>
        )
    }

    // Loads the category based on its ID

    const preload = (categoryId) => {
        getCategory(categoryId).then(data => {
            console.log(data)
            if (data.error) {
                setError(true)
            } else {
                setName(data.name)
            }
        })
    }

    useEffect(() => {
        preload(match.params.categoryId)
    }, [])

    // Handling form

    const handleChange = event => {
        setError("");
        setName(event.target.value);
    }



    // Handling submit button

    const onSubmit = (event) => {
        event.preventDefault();
        setError("");
        setSuccess(false);

        // Backend request fired

        updateCategory(match.params.categoryId, user._id, token, {name}).then(data => {
            if (data.error) {
                setError(true)
            } else {
                setError("")
                setSuccess(true)
                setName("")
            }
            console.log(data)
        })
    }

    // Success Message

    const successMessage = () => {
        if (success) {
            return <h4 className="text-success py-3">Category was updated successfully</h4>
        }
    }

    // Error Message

    const errorMessage = () => {
        if (error) {
            return <h4 className="text-danger py-3">Failed to update category</h4>
        }
    }


    // Form

    const myCategoryForm = () => {
        return (
            <form>
                <div className="form-group">
                    <p className="lead">Update the category</p>
                    <input type="text" className="form-control my-3" onChange={handleChange} value={name} autoFocus required placeholder="For Ex: Summer" />
                    <button className="btn btn-outline-info" onClick={onSubmit}>Update Category</button>
                </div>
            </form>
        )
    }

    return (
        <Base title="Create a category here" description="Add a new category for T-shirts" className="container bg-info p-4">
            <div className="row bg-white rounded">
                <div className="col-md-8 offset-md-2">
                    {successMessage()}
                    {errorMessage()}
                    {myCategoryForm()}
                    {goBack()}
                </div>
            </div>
        </Base>
    )
}

export default UpdateCategory;
const Category = require("../models/category");

exports.getCategoryId = (req, res, next, id) => {
    Category.findById(id).exec((err, category) => {
        if(err){
            return res.status(400).json({
                error: "No category was found in DB."
            });
        }
        req.category = category;
        next();
    });
};

// Creating a new category in DB

exports.createCategory = (req, res) => {
    const category = new Category(req.body);
    category.save((err, category) => {
        if(err){
            return res.status(400).json({
                error: "Not able to save the category in DB."
            });
        }
        return res.json({category});
    });
};

// Fetching category by ID

exports.getCategory = (req,res) => {
    return res.json(req.category);
}

// Fetching all the categories

exports.getAllCategories = (req, res) => {
    Category.find().exec((err, categories) => {
        if(err){
            return res.status(400).json({
                error: "No categories are found in DB."
            });
        }
        return res.json(categories);
    });
}

// Updating Category

exports.updateCategory = (req, res) => {
    const category = req.category;
    category.name = req.body.name;
    category.save((err, updatedCategory) => {
        if(err){
            return res.status(400).json({
                error: "Failed to update the category."
            });
        }
        return res.json(updatedCategory);
    });
};

// Deleting the category

exports.removeCategory = (req,res) => {
    const category = req.category;
    category.remove((err, category) => {
        if(err){
            return res.status(400).json({
                error: "Failed to delete the category from DB."
            });
        }
        return res.json({
            message: "Successfully deleted the category from DB."
        });
    });
};
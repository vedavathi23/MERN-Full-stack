const User = require("../models/user");
const Order = require("../models/order");


// Fetching user by sending ID as a parameter

exports.getUserById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if(err || !user){
            return res.status(400).json({
                error: "No user found in DB"
            })
        }
        req.profile = user;
        next();
    })
}

// Fetching user details

exports.getUser = (req, res) => {
    //TODO: get back here for password
    req.profile.salt = undefined;
    req.profile.encry_password = undefined;
    return res.json(req.profile);
}

// Fetches all users

exports.getAllUsers = (req,res) => {
    User.find().exec((err, users) => {
        if(err || !users){
            return res.status(400).json({
                error: "No users are found in DB"
            })
        }
        res.json(users);
    })
}

// Update the user

exports.updateUser = (req, res) => {
    User.findByIdAndUpdate(
        {_id: req.profile._id},
        {$set: req.body},
        { new: true, useFindAndModify: false}, (err, user) => {
            if(err){
                return res.status(400).json({
                    error: "You are not authorized to update this user."
                })
            }

            user.salt = undefined;
            user.encry_password = undefined;
            res.json(user);
        }
    );
};

// Finding user purchase list

exports.userPurchaseList = (req, res) => {
    Order.find({user: req.profile._id})
    .populate("user", "_id name")
    .exec((err, order) => {
        if(err){
            return res.status(400).json({
                error: "No orders found in this user account."
            });
        }
        return res.json(order);
    });
};

// Updating/pushing orders into user purchase list

exports.pushOrderInPurchaseList = (req, res, next) => {
        let purchases = [];
        req.body.order.products.forEach(product => {
        purchases.push({
            _id: product._id,
            name: product.name,
            category: product.category,
            description: product.description,
            quantity: product.quantity,
            transaction_id: req.body.order.transaction_id,
            amount: req.body.order.amount
        });
    });


    // Store the purchaselist in DB

    User.findOneAndUpdate(
        {_id: req.profile._id},
        {$push: {purchases: purchases}},
        {new: true},
        (err, purchases) => {
            if(err){
                return res.status(400).json({
                    error: "Unable to save the purchase list in DB."
                })
            }
            next();
        }
    )
}
const authorModel = require("../model/authorModel")
const jwt = require("jsonwebtoken");
const blogModel = require("../model/blogModel");
const mongoose = require('mongoose');



const mid1 = function (req, res, next) {
    try {
        let token = req.headers["x-api-key"];
        if (!token) return res.status(400).send({ status: false, msg: "token must be present" });
        let decodedToken = jwt.verify(token, "functionup-radon", 
        
        function(err,decodedToken){
            if(err)
            return res.status(401).send({status:false,message:"Token is NOT Valid"})

            next()
        } );
        
    } catch (error) {
        res.status(500).send({ msg: error.message })
    }
}

const mid2 = async function (req, res, next) {
    try{
    let token = req.headers["x-api-key"];
    if (!token) token = req.headers["x-api-key"];

    let decodedToken = jwt.verify(token, 'functionup-radon')

    if (!decodedToken) return res.send({ status: false, msg: "token is not valid" })
    blogToBeModified = req.params.blogId
    var isValid = mongoose.Types.ObjectId.isValid(blogToBeModified)
    if (!isValid) return res.status(400).send({ status: false, msg: "enter valid id" })
    let blogData = await blogModel.findById(blogToBeModified)
    if(!blogData){return res.status(404).send({status:false,msg:"blog not found"})}
    let authId = blogData.authorId
    let userLoggedIn = decodedToken.authoRId
    if (authId == userLoggedIn) {
        next()
    } else { return res.status(403).send({ status: false, msg: 'User logged is not allowed to modify the requested users data' }) }
}
catch (error) {
    res.status(500).send({ msg: error.message })
}
}

const mid3 = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key"];
        let decodedToken = jwt.verify(token,  'functionup-radon');
        let id = req.query.authorId
        let authorLoggedIn = decodedToken.authoRId
        if(id){
            var isValid = mongoose.Types.ObjectId.isValid(id)
            if (!isValid) return res.status(400).send({ status: false, msg: "enter valid author id" })
            //if(!isValidObjectId(id))return res.status(400).send({status:false,msg:"Enter Valid authorId"})
            if(id != authorLoggedIn) return res.status(403).send({ status: false, msg: 'author logged is not allowed to modify the requested users data' })
        }
        if (Object.keys(req.query).length < 1) return res.status(400).send({ status: false, msg: "query params is not given" })
        if(!id) req.query.authorId = authorLoggedIn
        next()
    }
    catch (error) {
        res.status(500).send({ msg: error.message })
    }
}



const mid4 = async function (req, res, next) {
    try{
     let token = req.headers["x-api-key"];
     if (!token) token = req.headers["x-api-key"];

     let decodedToken = jwt.verify(token, 'functionup-radon')

     if (!decodedToken) return res.status(401).send({ status: false, msg: "token is not valid" })
    data = req.body
    if (Object.keys(data).length == 0) {
        return res.status(400).send({ status: false, msg: "Body should not be Empty.. " })
    }
    let authorId= data.authorId
    if (!authorId || authorId===undefined) return res.status(400).send({ status: false, msg: "autorId is required" })
        var isValid = mongoose.Types.ObjectId.isValid(authorId)
        if (!isValid) return res.status(400).send({ status: false, msg: "Enter valid id" })
    
    let userLoggedIn = decodedToken.authoRId
    if (authorId == userLoggedIn) {
        next()
    } else { return res.status(403).send({ status: false, msg: 'author must enter his own Id while creating a blog' }) }
}catch (error) {
    res.status(500).send({ msg: error.message })
}
}









module.exports.mid1 = mid1
module.exports.mid2 = mid2
module.exports.mid3 = mid3
module.exports.mid4 = mid4


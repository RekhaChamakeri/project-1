const blogModel = require("../model/blogModel");
const mongoose = require('mongoose');
const authorModel = require("../model/authorModel");
const objectId=mongoose.Types.ObjectId
const isValid1 = function (value) {
    if (!value || value === undefined) return false
    if (typeof value !== "string" || value.trim().length === 0) return false
    return true
}


/*----------------CreateBlog-----------------------------*/

const createBlog = async function (req, res) {
    try {

        let data = req.body
        console.log(data)
        
       
            
        const { title, body, authorId,tags, category, subcategory,isDeleted,isPublished} = data

        //===========title validation=================
        if (!isValid1(title)) { return res.status(400).send({ status: false, msg: "title is required" }) }
       
        let title1 = /\w*\s*|\w|\D/.test(title.trim())
        if (!title1) return res.status(400).send({ stats: true, msg: "enter valid title" })

        //=========================body validation============

        if (!isValid1(body)) { return res.status(400).send({ status: false, msg: "body is required" }) }
       
        let body1 = /\w*\s*|\w|\D/.test(body.trim())
        if (!body1) return res.status(400).send({ stats: true, msg: "enter valid body" })

    
        //====================================tags validation==========================
      
    
        if (data.hasOwnProperty("tags")) {
            if (typeof tags !== "string" || tags.trim().length === 0) {
                if (Array.isArray(tags)) {
                    for (let i = 0; i < tags.length; i++) {
                        if (typeof tags[i] != 'string') return res.status(400).send({ status: false, msg: " tag2 should be string" })
                    }

                } else { return res.status(400).send({ status: false, msg: "tag should be a string" }) }
            }

        }
        //==================================category=======================================
   
        if (!category || category == undefined) return res.status(400).send({ status: false, msg: "category is required" })
        if (typeof category !== "string") {
            if (Array.isArray(category)) {
                for (let i = 0; i < category.length; i++) {
                    if (typeof category[i] != 'string') return res.status(400).send({ status: false, msg: " category should be string and should not contain spaces" })
                }

            } else { return res.status(400).send({ status: false, msg: "category should be a string" }) }
        }


        //===========================================subcategory=================================

  
        if (data.hasOwnProperty("subcategory")) { //return res.status(400).send({ status: false, msg: "subcategory is required" })
            if (typeof subcategory !== "string" || subcategory.trim().length === 0) {
                if (Array.isArray(subcategory)) {
                    for (let i = 0; i < subcategory.length; i++) {
                        if (typeof subcategory[i] != 'string') return res.status(400).send({ status: false, msg: " subcategory should be string" })
                    }

                } else { return res.status(400).send({ status: false, msg: "subcategory should be a string" }) }
            }
        }

        //===============================================isDeleted validation======================================
     
        if (data.hasOwnProperty("isDeleted")) {
            if (typeof isDeleted !== "boolean") { return res.status(400).send({ status: false, msg: "isDeleted should contain a boolean value" }) }
        }

        //===============================================isPublished validation=====================================
       
        if (data.hasOwnProperty("isPublished")) {
            if (typeof isPublished !== "boolean") { return res.status(400).send({ status: false, msg: "isPublished should contain a boolean value" }) }
        }


        if(data.isPublished==true){ data.publishedAt=Date.now()}
        if(data.isDeleted==true){ data.deletedAt=Date.now()}
        let blogData = await blogModel.create(data)
        res.status(201).send({ status: true, Data: blogData })
    }
    
        

    catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}
/*..........................................................create blog ends here..............................................*/




//...............................................................getblogs.........................................................

const getBlogs = async function (req, res) {
    try {
        let id = req.query.authorId
        let Category = req.query.category
        let tag = req.query.tags
        let subcategory = req.query.subcategory
        if (id === undefined && Category === undefined && tag === undefined && subcategory === undefined) {
            let allBlogs = await blogModel.find({ isDeleted: false, isPublished: true })

            if (allBlogs.length == 0) { return res.status(404).send({ status: false, msg: " no blogs found" }) }
            else { res.status(200).send({ status: true, data: allBlogs }) }
        }
        else {
            let blogsWithFilter = await blogModel.find({ isDeleted: false, isPublished: true, $or: [{ authorId: id }, { category: Category }, { tags: tag }, { subcategory: subcategory }] })
            if (blogsWithFilter.length == 0) {
                res.status(404).send({ status: false, msg: "no blog found" })
            }
            else {
                res.status(200).send({ status: true, data: blogsWithFilter })
            }
        }
    }
    catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }
};

/*.............................................get blogs ends here................................................*/



//............................Start Put Api's....................../
const updateBlog = async function (req, res) {
    try {
        let blogId = req.params.blogId;
        // var isValid = mongoose.Types.ObjectId.isValid(blogId)
        // if (!isValid) return res.status(400).send({ status: false, msg: "Enter valid id" })

        let saveData = await blogModel.findById(blogId)
        if (!saveData) return res.status(404).send({ status: false, msg: "blog not exist's " })
        let deletedh = saveData.isDeleted
        if (deletedh) return res.status(400).send({ status: false, msg: " you can't Update data blog is deleted" })
        let BlogData = req.body;
        const { title, body, tags, subcategory, category } = BlogData;

        if (Object.keys(BlogData).length == 0) {
            return res.status(400).send({ status: false, msg: "Body should not be Empty.. " })
        }

        //==========================title validation==============
        if (BlogData.hasOwnProperty("title")) {
            let title = BlogData.title
            if (typeof title !== "string" || title.trim().length === 0) return res.status(400).send({ status: false, msg: "title should be string" })

            let title1 = /\w*\s*|\w|\D/.test(title.trim())
            if (!title1) return res.status(400).send({ stats: true, msg: "enter valid title" })
        }
        //=========================body validation============
        if (BlogData.hasOwnProperty("body")) {
            let body = BlogData.body
            if (typeof body !== "string" || body.trim().length === 0) return res.status(400).send({ status: false, msg: "body should be string" })

            let body1 = /\w*\s*|\w|\D/.test(body.trim())
            if (!body1) return res.status(400).send({ stats: true, msg: "enter valid body" })
        }
        //==================================validation for tags==================

        if (BlogData.hasOwnProperty("tags")) {
            let tags = BlogData.tags

            if (typeof tags !== "string" || tags.trim().length === 0) {
                if (Array.isArray(tags)) {
                    for (let i = 0; i < tags.length; i++) {
                        if (typeof tags[i] != 'string') return res.status(400).send({ status: false, msg: " tags should be string" })
                    }

                } else { return res.status(400).send({ status: false, msg: "tag should be a string" }) }
            }
        }

        //=============================================sucategory validation======================

        if (BlogData.hasOwnProperty("subcategory")) {
            let subcategory = BlogData.subcategory
            if (data.hasOwnProperty("subcategory")) {
                if (typeof subcategory !== "string" || subcategory.trim().length === 0) {
                    if (Array.isArray(subcategory)) {
                        for (let i = 0; i < subcategory.length; i++) {
                            if (typeof subcategory[i] != 'string') return res.status(400).send({ status: false, msg: " subcategory should be string" })
                        }

                    } else { return res.status(400).send({ status: false, msg: "subcategory should be a string" }) }
                }
            }
        }
        // if (saveData.isDeleted == true) {
        //     return res.status(400).send({ status: false, msg: "Blog already deleted" })
        // }
        let updatedblog = await blogModel.findByIdAndUpdate({ _id: blogId }, { $addToSet: { tags: tags, subcategory: subcategory }, $set: { title: title, body: body, category: category, isPublished: true, publishedAt: Date.now() } }, { new: true });

        res.status(200).send({ status: true, data: updatedblog });
    }
    catch (Err) {
        res.status(500).send({ status: false, msg: Err.message })
    }
}
//...........................................................put api ends here..........................................



/*.........................................................delete api........................................................... */
//DELETE /blogs/:blogId
//- Check if the blogId exists( and is not deleted). If it does, mark it deleted and return an HTTP status 200 without any response body.
//- If the blog document doesn't exist then return an HTTP status of 404 with a body like [this](#error-response-structure) 

const deleteBlogs = async function (req, res) {
    try {
        let blogId = req.params.blogId
        // console.log(blogId)
        // var isValid = mongoose.Types.ObjectId.isValid(blogId)
        // if (!isValid) return res.status(400).send({ status: false, msg: "enter valid id" })
        let id = await blogModel.findById(blogId)
        let isdeleted=id.isDeleted
        if(isdeleted){
        return res.status(400).send({status:false,msg:"data is already deleted"})}
        if (id) {
            let updateBlog = await blogModel.findOneAndUpdate({ _id: blogId }, { isDeleted: true }, { new: true })
            updateBlog.deletedAt=Date.now()
            res.status(200).send({ status: true,msg:"data deleted now" ,deletedAt:updateBlog.deletedAt})
        }
        else { res.status(404).send({ msg: "blog not found" }) }
    }
    catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }

}
/*.........................................................delete api ends here..............................................................*/



//.............................................delete........................................................................
const deleteUser = async function (req, res) {
    try {

        let authorid = req.query.authorId;
        let Category = req.query.category;
        let Subcategory = req.query.subcategory;
        let tag = req.query.tags;
        let unpublished = req.query.isPublished
       

        let deletedData = await blogModel.findOneAndUpdate({ $or: [{ authorId: authorid }, { isPublished: unpublished }, { category: Category }, { tags: tag }, { subcategory: Subcategory }] }, { isDeleted: true }, { new: true })
        if (!deletedData) {
            return res.status(404).send("No such blog exists")
        }
        else {
            deletedData.deletedAt=Date.now()
            res.status(200).send({ status: true, msg: "Data deleted now",deletedAt:deletedData.deletedAt })
        }
    }
    catch (err) {
        res.status(500).send({ error: err.message })
    }
}

/*..................................................................delete.......................................................................*/






module.exports.createBlog = createBlog
module.exports.getBlogs = getBlogs
module.exports.deleteBlogs = deleteBlogs
module.exports.deleteUser = deleteUser
module.exports.updateBlog = updateBlog



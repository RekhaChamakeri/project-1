const express = require('express');
const router = express.Router();
const authorController=require("../controller/authorController")
const blogController=require("../controller/blogController")
const middleware=require("../middlewre/auth.js")

router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})

router.post("/authors",authorController.createAuthor)
router.post("/blogs",middleware.mid1,middleware.mid4,blogController.createBlog)
router.get("/blogs",middleware.mid1,blogController.getBlogs)
router.delete("/blogs/:blogId",middleware.mid1,middleware.mid2,blogController.deleteBlogs)
router.put("/blogs/:blogId",middleware.mid1,middleware.mid2,blogController.updateBlog)
router.delete("/blogs",middleware.mid1,middleware.mid3,blogController.deleteUser)
router.post("/login",authorController.loginAuthor)

module.exports = router;
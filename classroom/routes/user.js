const express = require("express");
const router = express.Router();

router.get("/",(req,res) => {
    res.send("user show");
})

router.get("/:id",(req,res) => {
    res.send("user id");
})

router.post("/:id",(req,res) => { //i can just write /:id bexause /users is already in server.js
    res.send("user post");
})

router.delete("/:id",(req,res) => {
    res.send("user delete");
})

module.exports = router;
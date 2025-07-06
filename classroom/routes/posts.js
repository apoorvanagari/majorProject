const express = require("express");
const router = express.Router();

router.post("/:id",(req,res) => {
    res.send("post get");
})

router.get("/",(req,res) => {
    res.send("post show");
})


router.delete("/:id",(req,res) => {
    res.send("post delete");
})

module.exports = router;

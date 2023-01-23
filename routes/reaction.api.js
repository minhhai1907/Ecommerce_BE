const express=require("express")
const authMiddleware = require("../middlewares/authentication")
const reactionController=require("../controllers/reaction.controller")
const router=express.Router()

router.post(
    "/",
    authMiddleware.loginRequired,
    reactionController.createReaction)

module.exports=router
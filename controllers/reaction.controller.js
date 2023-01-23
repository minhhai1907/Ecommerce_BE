const { catchAsync, sendResponse } = require("../helpers/utils");
const Product = require("../models/Product");
const Reaction = require("../models/Reaction");
const Review = require("../models/Reviews");


const reactionController={}

reactionController.checkExistReaction = async function (userId) {
    const reaction = Reaction.findOne({ userId });
    return !!reaction;
  };
  
  reactionController.getAllReactions = async function (query) {
    const reactions = await Reaction.paginate(query);
  
    return reactions;
  };
  

reactionController.createReaction=catchAsync(async(req,res,next)=>{
    const userId=req.userId
    const { targetId, rate, refPaths } = req.body;

  let reaction = await Reaction.findOne({
    refPaths,
    targetId,
    userId,
  });

  let message = "";
  if (!reaction) {
    await Reaction.create({ refPaths, targetId, userId, rate });
    message = "Added reaction";
  } else {
    reaction.rate = rate;
    await reaction.save();

    message = "Updated reaction";
  }

  const totalRating = await Reaction.calTotalRating(targetId);

  if (refPaths === "Products") {
    await Product.findOneAndUpdate({ _id: targetId }, { ...totalRating });
  }

  if (refPaths === "Reviews") {
    await Review.findOneAndUpdate( {_id:targetId} , {...totalRating  });
  }

  return sendResponse(
    res,
    200,
    true,
    totalRating,
    "",
    "Create reaction success"
  );
})
module.exports=reactionController
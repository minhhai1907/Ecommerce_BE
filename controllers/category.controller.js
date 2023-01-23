const { AppError, catchAsync, sendResponse } = require("../helpers/utils");
const Category = require("../models/Category");


const category={}

category.getAllCategories=catchAsync(async(req,res,next)=>{
    const categories=await Category.find().populate("parent")
    return sendResponse(
        res,
        200,
        true,
        categories,
        "",
        "Get All Category successfully"
      );
})
category.getMainCategories=catchAsync(async(req,res,next)=>{
    const categories=await Category.find({parent:null})
    return sendResponse(
        res,
        200,
        true,
        categories,
        "",
        "Get main Category successfully"
      );
})
category.getSubCategories=catchAsync(async(req,res,next)=>{
  const id=req.params.id
    const categories=await Category.find({parent:id})
    return sendResponse(
        res,
        200,
        true,
        categories,
        "",
        "Get subs Category successfully"
      );
})

category.createCategory=catchAsync(async(req,res,next)=>{
    const category=await Category.create(req.body)
    return sendResponse(
        res,
        200,
        true,
        category,
        "",
        "Create Category successfully"
      );
})
category.createSubCategory=catchAsync(async(req,res,next)=>{
    const {id}=req.params
    let body=req.body
    body.parent=id
    const category=await Category.create(body)
    return sendResponse(
        res,
        200,
        true,
        category,
        "",
        "Create Category successfully"
      );
})
category.updateCategory=catchAsync(async(req,res,next)=>{
    const {id}=req.params
    const data=req.body
    let category = await Category.findById(id);

    if (!category) {
        throw new AppError(404, "Category Not Found", "Update Category");
      }
     Object.keys(data).forEach((field) => {
    if (data[field] !== undefined) {
      category[field] = data[field];
    }
  });

  await category.save();
    return sendResponse(
        res,
        200,
        true,
        category,
        "",
        "Update Category successfully"
      );
})
category.deleteCategory=catchAsync(async(req,res,next)=>{
    const {id}=req.params
   
    let category = await Category.findByIdAndUpdate(id,{isDeleted:true});

    if (!category) {
        throw new AppError(404, "Category Not Found", "Delete Category");
      }
    return sendResponse(
        res,
        200,
        true,
        {},
        "",
        "Delete Category successfully"
      );
})

module.exports=category
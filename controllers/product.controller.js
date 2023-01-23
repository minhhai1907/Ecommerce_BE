const { AppError, catchAsync, sendResponse } = require("../helpers/utils");
const Description = require("../models/Description");
const Product = require("../models/Product");
const fs=require("fs");
const User = require("../models/User");
var mongoose = require("mongoose")


const productController={};

productController.checkExistProduct = async function (ProductId) {
  const product = await Product.findById(ProductId);

  return !!product;
};
productController.testProducts=catchAsync(async(req,res,next)=>{
  const query=req.query
  const products=await Product.find({rateAverage:{$lt:5,$gt:1 },rating:1,categoryId:"63b6512f6599708a26ea6878",price:{$lt:650,$gt:0}})
  return sendResponse(
    res,
    200,
    true,
    products,
    "",
    "Get Products Test successfully"
  )
})

productController.getAllProducts=catchAsync(async(req,res,next)=>{
    let query=req.query
    query.populate = "descriptions";
    const  userId  = req.userId;
    const user=await User.findById(userId)
    console.log("userId",userId)
  if (user?.role !== "admin") {
    query.isDeleted = false;
  }
  if (query.title) {
    query.title = { $regex: query.title, $options: "i" };
  } else {
    delete query.title;
  }

  if (user?.role === "admin") {
    query.populate = "categoryId";
  }
  // query.populate = "categoryId";

  const sortBy = query.sortBy && query.sortBy.toLowerCase();

  if (sortBy === "new") {
    query.status = "new";
    query.sortBy = query.sortBy + ",updatedAt.desc";
  }

  if (sortBy?.includes("discount")) {
    query.status = "sale";
  }

  if (query.rating) {
    query.rateAverage = {
      $gte: parseInt(query.rating),
      $lte: 5,
    };
  }

  if (query.price_max && query.price_min) {
    query.price = {
      $lte: parseInt(query.price_max) || 1000000000,
      $gte: parseInt(query.price_min) || 0,
    };
    delete query.price_max;
    delete query.price_min;
  }
  const products = await Product.paginate(query);
  return sendResponse(
    res,
    200,
    true,
    products,
    "",
    "Get Products successfully"
  );
  
})
productController.getProductById=catchAsync(async(req,res,next)=>{
  const productId=req.params.id
  const product=await Product.findById(productId).populate("descriptions")
  return sendResponse(
    res,
    200,
    true,
    product,
    "",
    "Get Product by Id successfully"
  );
})
productController.deleteProduct=catchAsync(async(req,res,next)=>{
  const productId=req.params.id
  const product=await Product.findByIdAndUpdate(productId,{isDeleted:true})
  return sendResponse(
    res,
    200,
    true,
    {},
    "",
    "Delete Product successfully"
  );
})
productController.updateProduct=catchAsync(async(req,res,next)=>{
  const productId=req.params.id
  let product = await Product.findById(productId);

  if (!product) {
    throw new AppError(404, "Product Not Found", "Update product");
  }

  const { descriptions, ...restBody } = req.body;
  if (descriptions && product.descriptions) {
    const description = await Description.findById(product.descriptions);
    if (!description) {
      throw new AppError(
        404,
        "Descriptions is not found",
        "Update description of Product"
      );
    }
    description.content = descriptions;
    description.save();
  }

  Object.keys(restBody).forEach((field) => {
    if (restBody[field] !== undefined) {
      product[field] = restBody[field];
    }
  });

  await product.save();
  return sendResponse(
    res,
    200,
    true,
    product,
    "",
    "Update Product successfully"
  );
})
productController.createProduct=catchAsync(async(req,res,next)=>{
    // const response= await fs.readFileSync("./final/camera2.json","utf-8")
    // const data=JSON.parse(response)
    // const products=data.forEach(async (item)=>{
    //     let {descriptions,...restItem}=item;
    //     if(restItem.categoryId==="6278e4e919a7ab61193236f5"){
    //         restItem.categoryId=   mongoose.Types.ObjectId("63b64ebf6599708a26ea6860"); 
    //     }
    //     if(restItem.categoryId==="6278e4e919a7ab61193236f6"){
    //         restItem.categoryId=mongoose.Types.ObjectId("63b64f086599708a26ea6863")
    //     }
        
    //     if(restItem.categoryId==="6278e4e919a7ab61193236f7"){
    //         restItem.categoryId=mongoose.Types.ObjectId("63b650c26599708a26ea686f")
    //     }
    //     if(restItem.categoryId==="6278e4e919a7ab61193236f8"){
    //         restItem.categoryId=mongoose.Types.ObjectId("63b650df6599708a26ea6872")
    //     }
    //     if(restItem.categoryId==="6278e4e919a7ab61193236f9"){
    //         restItem.categoryId=mongoose.Types.ObjectId("63b651136599708a26ea6875")
    //     }
    //     if(restItem.categoryId==="6278e4e919a7ab61193236fa"){
    //         restItem.categoryId=mongoose.Types.ObjectId("63b6512f6599708a26ea6878")
    //     }
    //     if(restItem.categoryId==="6278e4e919a7ab61193236fb"){
    //         restItem.categoryId=mongoose.Types.ObjectId("63b651466599708a26ea687b")
    //     }
    //     if(restItem.categoryId==="6278e51423d8a01922e9f708"){
    //         restItem.categoryId=mongoose.Types.ObjectId("63b64fa76599708a26ea6866")
    //     }
    //     if(restItem.categoryId==="6278e51423d8a01922e9f709"){
    //         restItem.categoryId=mongoose.Types.ObjectId("63b64fa76599708a26ea6869")
    //     }
    //     if(restItem.categoryId==="6278e51423d8a01922e9f70a"){
    //         restItem.categoryId=mongoose.Types.ObjectId("63b6503f6599708a26ea686c")
    //     }
    //     if(restItem.categoryId==="6278e68a93e6f457741e58e1"){
    //         restItem.categoryId=mongoose.Types.ObjectId("63b651b16599708a26ea687e")
    //     }
    //     if(restItem.categoryId==="6278e68a93e6f457741e58e2"){
    //         restItem.categoryId=mongoose.Types.ObjectId("63b651c46599708a26ea6881")
    //     }
    //     if(restItem.categoryId==="6278e6a78f94eedc909f1db9"){
    //         restItem.categoryId=mongoose.Types.ObjectId("63b651d16599708a26ea6884")
    //     }
    //     if(restItem.categoryId==="6278e6a78f94eedc909f1dbc"){
    //         restItem.categoryId=mongoose.Types.ObjectId("63b651df6599708a26ea6887")
    //     }
    //     if(restItem.categoryId==="6278e6a78f94eedc909f1dbd"){
    //         restItem.categoryId=mongoose.Types.ObjectId("63b651df6599708a26ea688a")
    //     }
    //     if(restItem.categoryId==="6278e6a78f94eedc909f1dbe"){
    //         restItem.categoryId=mongoose.Types.ObjectId("63b651df6599708a26ea688d")
    //     }
    //     if(restItem.categoryId==="6278e6a78f94eedc909f1dbf"){
    //         restItem.categoryId=mongoose.Types.ObjectId("63b651df6599708a26ea6890")
    //     }
    //     if(restItem.categoryId==="6278e6a78f94eedc909f1dc0"){
    //         restItem.categoryId=mongoose.Types.ObjectId("63b652606599708a26ea6893")
    //     }
    //     if(restItem.categoryId==="6278e6a78f94eedc909f1dc1"){
    //         restItem.categoryId=mongoose.Types.ObjectId("63b652716599708a26ea6896")
    //     }
    //     if(restItem.categoryId==="6278e6a78f94eedc909f1dc2"){
    //         restItem.categoryId=mongoose.Types.ObjectId("63b6527f6599708a26ea6899")
    //     }
    //     if(restItem.categoryId==="6278e6a78f94eedc909f1dc3"){
    //         restItem.categoryId=mongoose.Types.ObjectId("63b6528b6599708a26ea689c")
    //     }
    //     if(restItem.categoryId==="6278e6a78f94eedc909f1dc4"){
    //         restItem.categoryId=mongoose.Types.ObjectId("63b669c5e59d5e550309c861")
    //     }
    //     if(restItem.categoryId==="6278e6a78f94eedc909f1dc5"){
    //         restItem.categoryId=mongoose.Types.ObjectId("63b652bd6599708a26ea689f")
    //     }
    //     if(restItem.categoryId==="6278e6a78f94eedc909f1dc6"){
    //         restItem.categoryId=mongoose.Types.ObjectId("63b652cb6599708a26ea68a2")
    //     }
    //     if(restItem.categoryId==="6278e6a78f94eedc909f1dc7"){
    //         restItem.categoryId=mongoose.Types.ObjectId("63b652d76599708a26ea68a5")
    //     }
    //     if (descriptions) {
    //         const description = await Description.create({ content: descriptions });
    //         restItem.descriptions = description._id;
    //       }
    //       const product = await Product.create(restItem); 
    //       return product
    //    })
    // if (descriptions) {
    //     const description = await Description.create({ content: descriptions });
    //     restBody.description = description._id;
    //   }
    //   const product = await Product.create(restBody);
    const { descriptions, ...restProductBody } = req.body;
    if (descriptions) {
      const description = await Description.create({ content: descriptions });
      restProductBody.descriptions = description._id;
    }
    const product = await Product.create(restProductBody);
  
    

      return sendResponse(
        res,
        200,
        true,
        product,
        "",
        "Create Product successfully"
      );
})

module.exports=productController
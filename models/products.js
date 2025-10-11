const mongoose = require ("mongoose");
//defiing the schema
const productSchema = new mongoose.Schema({
    name: {type: String, required:true},
    description:{type:String, reuqired:true},
    price:{type:Number, reuqired:true},
    category:{type:String, required:true},
    inStock:{type:Boolean,required:true}
});

//create the model
const Products1 =mongoose.model("Products1", productSchema)
module.exports =Products1;
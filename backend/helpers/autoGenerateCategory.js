const StoreSchema = require('../models/store.model')

exports.autoGenerateCategory = async (storeId) => {
    var newArray = []
  
    try {
      const {products} = await StoreSchema.findById(storeId).populate(
        "products",
        "tags -_id"
      );
      if(!products.length) return []
  
      products.forEach(item => {
        for(let index in item.tags){
          newArray.push(item.tags[index])
        }
      })
  
      const uniqueTags = [...new Set(newArray)]
  
      return uniqueTags

    } catch (error) {
      console.log(error);
    }
  };
const clothesSchema = require('../models/clothes.models')

exports.addClothes = (req, res) => {
    const newCloth = new clothesSchema();
    
    newCloth.title = req.body.title
    newCloth.description = req.body.description
    newCloth.tags = req.body.tags
    newCloth.genre = req.body.genre
    newCloth.features = req.body.features
    newCloth.thumbnail = req.body.thumbnail
    newCloth.images = req.body.images
    
    newCloth.save(function (err, data){
        if(err){
            console.log(err)
        }else{
            res.send('Product saved successfully')
        }
    })
}
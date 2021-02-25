const { add, update} = require('../../controllers/product.controller');
const uploadProductImages = require('../../middlewares/upload.product');

const router = require('express').Router();

router.route('/')
.post(uploadProductImages.array('images'),add)
.put(update)

module.exports = router;
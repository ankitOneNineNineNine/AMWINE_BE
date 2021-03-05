const { getAll, getById , search, update, searchLatest, getVariety, postReview, add} = require('../../controllers/product.controller');
const authenticate = require('../../middlewares/authenticate');
const { secondaryAuthorization } = require('../../middlewares/authorize');
const uploadProductImages = require('../../middlewares/upload.product');


const router = require('express').Router();


router.route('/')
.all(authenticate, secondaryAuthorization)
.post(uploadProductImages.array('images'),add)
.get(getAll)

router.route('/search')
.get(searchLatest)
.post(search)

router.get('/pr/varieties', getVariety)

router.route('/review')
.all(authenticate)
.post(postReview)


router.route('/:id')
.get(getById)
.put(authenticate, secondaryAuthorization, uploadProductImages.array('images'),update)


module.exports = router;
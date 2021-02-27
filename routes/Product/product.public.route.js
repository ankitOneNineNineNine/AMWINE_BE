const { getAll, getById , search, searchLatest} = require('../../controllers/product.controller');

const router = require('express').Router();

router.post('/', getAll)

router.route('/search')
.get(searchLatest)
.post(search)



router.route('/:id')
.get(getById)

module.exports = router;
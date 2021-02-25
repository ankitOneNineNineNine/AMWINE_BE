const { get, getById } = require('../../controllers/product.controller');

const router = require('express').Router();

router.route('/')
.get(get)


router.route('/:id')
.get(getById)

module.exports = router;
const datatypes = require('./lib/datatypes');
const { handleOrder } = require('./lib/handle-order');
const { handleProduct } = require('./lib/handle-product');

module.exports = {
    datatypes: datatypes,
    handleOrder: handleOrder,
    handleProduct: handleProduct
};
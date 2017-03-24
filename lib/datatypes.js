"use strict";
exports.__esModule = true;
var OrderType;
(function (OrderType) {
    OrderType[OrderType["Normal"] = 0] = "Normal";
})(OrderType = exports.OrderType || (exports.OrderType = {}));
var OrderStatus;
(function (OrderStatus) {
    OrderStatus[OrderStatus["Cancelled"] = 0] = "Cancelled";
    OrderStatus[OrderStatus["Created"] = 1] = "Created";
    OrderStatus[OrderStatus["CustomerAcknowledged"] = 2] = "CustomerAcknowledged";
    OrderStatus[OrderStatus["Processing"] = 3] = "Processing";
    OrderStatus[OrderStatus["Finished"] = 4] = "Finished";
    OrderStatus[OrderStatus["Closed"] = 5] = "Closed";
})(OrderStatus = exports.OrderStatus || (exports.OrderStatus = {}));
var ProductType;
(function (ProductType) {
    ProductType[ProductType["Normal"] = 0] = "Normal";
})(ProductType = exports.ProductType || (exports.ProductType = {}));
//# sourceMappingURL=datatypes.js.map
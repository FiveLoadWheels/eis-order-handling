"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
exports.__esModule = true;
var handle_order_1 = require("../handle-order");
var datatypes_1 = require("../datatypes");
var chai_1 = require("chai");
var source_map_support_1 = require("source-map-support");
source_map_support_1.install();
// import { assert } from 'util';
function createOrder() {
    var orderProto = {
        id: '<uuid>',
        ctime: Date.now(),
        mtime: Date.now(),
        type: datatypes_1.OrderType.Normal,
        status: datatypes_1.OrderStatus.Created,
        events: [],
        customer: {
            id: 'uid'
        },
        product: [
            {
                id: 'pid',
                type: datatypes_1.ProductType.Normal
            }
        ],
        quantity: 5
    };
    return orderProto;
}
describe('OrderHandler(Basic lifecycle)', function () {
    var order = createOrder();
    it('should not change the order when update called if no external factor was changed', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, handle_order_1.handleOrder(order, {
                        type: 'CUSTOMER_ACK',
                        payload: { resolved: false }
                    })];
                case 1:
                    _a.sent();
                    chai_1.expect(order.status).to.equal(datatypes_1.OrderStatus.Created);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should state the order as `CustomerAcknowledged` when customer confirm it', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, handle_order_1.handleOrder(order, {
                        type: 'CUSTOMER_ACK',
                        payload: { resolved: true }
                    })];
                case 1:
                    _a.sent();
                    chai_1.expect(order.status).to.equal(datatypes_1.OrderStatus.CustomerAcknowledged);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should state the order as `Processing` after certain personnels accepted it', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, handle_order_1.handleOrder(order, {
                        type: 'PROC_UPDATE',
                        payload: { success: false, newEvents: [] }
                    })];
                case 1:
                    _a.sent();
                    chai_1.expect(order.status).to.equal(datatypes_1.OrderStatus.Processing);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should state the order as `Finished` after finished successfully', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, handle_order_1.handleOrder(order, {
                        type: 'PROC_UPDATE',
                        payload: { success: true, newEvents: [] }
                    })];
                case 1:
                    _a.sent();
                    chai_1.expect(order.status).to.equal(datatypes_1.OrderStatus.Finished);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should state the order as `Closed` after customer confirm the product and give feedback, etc.', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, handle_order_1.handleOrder(order, {
                        type: 'ORDER_CONFIRM',
                        payload: { resolved: true }
                    })];
                case 1:
                    _a.sent();
                    chai_1.expect(order.status).to.equal(datatypes_1.OrderStatus.Closed);
                    return [2 /*return*/];
            }
        });
    }); });
});
describe('OrderHandler(Cancelling)', function () {
    it('should state the order as `Cancelled` when customer wants to discard it (before ack)', function () { return __awaiter(_this, void 0, void 0, function () {
        var order;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    order = createOrder();
                    return [4 /*yield*/, handle_order_1.handleOrder(order, {
                            type: 'CANCEL_ORDER',
                            payload: {}
                        })];
                case 1:
                    _a.sent();
                    chai_1.expect(order.status).to.equal(datatypes_1.OrderStatus.Cancelled);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should not state the order as `Cancelled` after customer ack', function () { return __awaiter(_this, void 0, void 0, function () {
        var order, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    order = createOrder();
                    return [4 /*yield*/, handle_order_1.handleOrder(order, {
                            type: 'CUSTOMER_ACK',
                            payload: { resolved: true }
                        })];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, handle_order_1.handleOrder(order, {
                            type: 'CANCEL_ORDER',
                            payload: {}
                        })];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    e_1 = _a.sent();
                    chai_1.expect(e_1).to.be.instanceOf(Error, 'Expect throws an error');
                    chai_1.expect(e_1.message).to.equal('Cannot cancel customer-acknowledged order');
                    return [3 /*break*/, 5];
                case 5:
                    chai_1.expect(order.status).not.eq(datatypes_1.OrderStatus.Cancelled);
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=handle-order.js.map
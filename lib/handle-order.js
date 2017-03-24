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
exports.__esModule = true;
// import { handleAction, Action } from './handler-util';
var datatypes_1 = require("./datatypes");
function handleOrder(order, action) {
    return __awaiter(this, void 0, void 0, function () {
        var process, process, userConfirm, _a;
        return __generator(this, function (_b) {
            // handle cancelling
            if (action.type === 'CANCEL_ORDER') {
                if (order.status >= datatypes_1.OrderStatus.CustomerAcknowledged) {
                    throw new Error('Cannot cancel customer-acknowledged order');
                }
                else {
                    order.status = datatypes_1.OrderStatus.Cancelled;
                    return [2 /*return*/, Promise.resolve()];
                }
            }
            switch (order.status) {
                case datatypes_1.OrderStatus.Cancelled:
                    // ...
                    break;
                case datatypes_1.OrderStatus.Created:
                    if (action.type === 'CUSTOMER_ACK') {
                        if (action.payload.resolved) {
                            order.status = datatypes_1.OrderStatus.CustomerAcknowledged;
                        }
                    }
                    ;
                    break;
                case datatypes_1.OrderStatus.CustomerAcknowledged:
                    {
                        if (action.type === 'PROC_UPDATE') {
                            process = action.payload;
                            if (process) {
                                order.status = datatypes_1.OrderStatus.Processing;
                            }
                        }
                    }
                    break;
                case datatypes_1.OrderStatus.Processing:
                    {
                        if (action.type === 'PROC_UPDATE') {
                            process = action.payload;
                            if (!process) {
                                throw new Error('Order is not ready for process');
                            }
                            else if (process.success) {
                                order.status = datatypes_1.OrderStatus.Finished;
                            }
                            else {
                                (_a = order.events).push.apply(_a, process.newEvents);
                            }
                        }
                    }
                    break;
                case datatypes_1.OrderStatus.Finished:
                    if (action.type === 'ORDER_CONFIRM') {
                        userConfirm = action.payload;
                        if (userConfirm.resolved) {
                            order.status = datatypes_1.OrderStatus.Closed;
                        }
                    }
                    break;
                case datatypes_1.OrderStatus.Closed:
                    break;
                default:
            }
            return [2 /*return*/, Promise.resolve()];
        });
    });
}
exports.handleOrder = handleOrder;
//# sourceMappingURL=handle-order.js.map
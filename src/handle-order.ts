// import { handleAction, Action } from './handler-util';
import { merge } from 'lodash';
import { Order, OrderStatus, Logistics, ProductStatus } from './datatypes';
// import  * as orderStatusQueryActions from './order';

import { ProductAction, handleProduct } from './handle-product';

export type OrderAction = 
    { type: 'CANCEL_ORDER', payload: {} } |
    { type: 'MODIFY_ORDER', payload: Order | object } |
    { type: 'CUSTOMER_ACK', payload: { resolved: boolean } } |
    { type: 'PROC_UPDATE', payload: { success: boolean } } |
    { type: 'START_DELIVERY', payload: { resolved: boolean } } |
    { type: 'ORDER_CONFIRM', payload: { resolved: boolean, arriveTime: number } } |
    ProductAction

export function handleOrder(order: Order, action: OrderAction): Order {
    // handle cancelling
    if (action.type === 'CANCEL_ORDER') {
        if (order.status >= OrderStatus.CustomerAcknowledged) {
            throw new Error('Cannot cancel customer-acknowledged order');
        }
        else {
            order.status = OrderStatus.Cancelled;
            return order;
        }
    }

    // handle modifying
    if (action.type === 'MODIFY_ORDER') {
        if (order.status >= OrderStatus.CustomerAcknowledged) {
            throw new Error('Cannot modify customer-acknowledged order');
        }
        else {
            merge(order, action.payload);
            return order;
        }
    }

    // basic lifecycle
    switch (order.status) {
    case OrderStatus.Cancelled:
        // ...
    break;

    case OrderStatus.Created:
        if (action.type === 'CUSTOMER_ACK')  {
            if (action.payload.resolved) {
                order.status = OrderStatus.CustomerAcknowledged;
                if (order.product.status === ProductStatus.Ready) {
                    // If we have inventories, we can directly skip the manufacturing process.
                    order.status = OrderStatus.ProcessFinished;
                }
            }
        };
    break;

    case OrderStatus.CustomerAcknowledged: { 
        handleProduct(order.product, action as ProductAction);
        if (order.product.status > ProductStatus.Initialized) {
            order.status = OrderStatus.ProcessStarted;
        }
    } break;

    case OrderStatus.ProcessStarted: {
        handleProduct(order.product, action as ProductAction);
        if (order.product.status === ProductStatus.Ready) {
            order.status = OrderStatus.ProcessFinished;
        }
    } break;

    case OrderStatus.ProcessFinished:
        if (action.type === 'START_DELIVERY' && action.payload.resolved) {
            order.status = OrderStatus.DeliveryStarted;
        }
    break;

    case OrderStatus.DeliveryStarted:
        if (action.type === 'ORDER_CONFIRM' && action.payload.resolved) {
            order.logistics.arriveTime = action.payload.arriveTime
            order.status = OrderStatus.DeliveryFinished;
        }
    break;

    case OrderStatus.DeliveryFinished:
        // if (action.type === 'ORDER_CONFIRM') {
        //     let userConfirm = action.payload;
        //     if (userConfirm.resolved) {
        //         order.status = OrderStatus.Closed;
        //     }
        // }
    break;

    case OrderStatus.Closed:

    break;

    default:
        // Never happen
    }

    return order;
}
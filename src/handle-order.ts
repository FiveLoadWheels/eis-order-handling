// import { handleAction, Action } from './handler-util';
import { Order, OrderStatus, Logistics } from './datatypes';

import  * as orderStatusQueryActions from './order';

type OrderAction = 
    { type: 'CANCEL_ORDER', payload: {} } |
    { type: 'CUSTOMER_ACK', payload: { resolved: boolean } } |
    { type: 'PROC_UPDATE', payload: { success: boolean } } |
    { type: 'START_DELIVERY', payload: { resolved: boolean } } |
    { type: 'ORDER_CONFIRM', payload: { resolved: boolean, arriveTime: number } }

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

    switch (order.status) {
    case OrderStatus.Cancelled:
        // ...
    break;

    case OrderStatus.Created:
        if (action.type === 'CUSTOMER_ACK')  {
            if (action.payload.resolved) {
                order.status = OrderStatus.CustomerAcknowledged;
            }
        };
    break;

    case OrderStatus.CustomerAcknowledged: {
        // If we have inventories, we can directly skip the manufacturing process.
        if (order.product && order.product.status === ProductStatus.Ready) {
            order.status = OrderStatus.ProcessFinished;
        }
        else if (action.type === 'PROC_UPDATE') {
            let process = action.payload;
            if (process) {
                order.status = OrderStatus.ProcessStarted;
            }
        }
    } break;

    case OrderStatus.ProcessStarted: {
        if (action.type === 'PROC_UPDATE') {
            let processAction = action.payload;
            handleProduct(order.product, processAction);
            if (order.product && order.product.status === ProductStatus.Ready) {
                order.status = OrderStatus.ProcessFinished;
            }
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
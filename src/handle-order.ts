// import { handleAction, Action } from './handler-util';
import { merge } from 'lodash';
import { IOrder, OrderStatus, Logistics, ProductStatus } from './datatypes';
// import  * as orderStatusQueryActions from './order';

import { ProductAction, handleProduct } from './handle-product';

export type OrderAction = 
    { type: 'CANCEL_ORDER', payload: {} } |
    { type: 'MODIFY_ORDER', payload: IOrder | object } |
    { type: 'CUSTOMER_ACK', payload: { resolved: boolean } } |
    { type: 'UPDATE_PRODUCT_PROCESS', payload: null } |
    { type: 'START_DELIVERY', payload: { address?: string } } |
    { type: 'END_DELIVERY', payload: { arriveTime: number } };

export function handleOrder(order: IOrder, action: OrderAction): IOrder {
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
                if (all(order.products, product => product.status === ProductStatus.Ready)) {
                    // If we have inventories, we can directly skip the manufacturing process.
                    order.status = OrderStatus.ProcessFinished;
                }
                else {
                    order.products.forEach(p => {
                        p.status = ProductStatus.Initialized;
                    });
                }
            }
        };
    break;

    case OrderStatus.CustomerAcknowledged: { 
        if (action.type === 'UPDATE_PRODUCT_PROCESS' &&
            order.products.some(product => product.status > ProductStatus.Initialized)) {
            order.status = OrderStatus.ProcessStarted;
        }
    } break;

    case OrderStatus.ProcessStarted: {
        if (action.type === 'UPDATE_PRODUCT_PROCESS' &&
            all(order.products, product => product.status === ProductStatus.Ready)) {
            order.status = OrderStatus.ProcessFinished;
        }
    } break;

    case OrderStatus.ProcessFinished:
        if (action.type === 'START_DELIVERY') {
            if (action.payload.address) {
                order.address = action.payload.address;
            }
            order.status = OrderStatus.DeliveryStarted;
        }
    break;

    case OrderStatus.DeliveryStarted:
        if (action.type === 'END_DELIVERY' && action.payload.arriveTime) {
            order.arriveTime = action.payload.arriveTime;
            order.status = OrderStatus.DeliveryFinished;
        }
    break;

    case OrderStatus.DeliveryFinished:
        // if (action.type === 'END_DELIVERY') {
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

function all<T>(arr: T[], test: (item: T) => boolean) {
    return !arr.some((item) => !test(item));
}
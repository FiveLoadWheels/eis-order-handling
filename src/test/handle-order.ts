import { handleOrder } from '../handle-order';
import { Order, OrderType, OrderStatus, ProductType } from '../datatypes';
import { expect } from 'chai';
import {  } from 'mocha';
import { install as installSourceMap } from 'source-map-support';
installSourceMap();
// import { assert } from 'util';

function createOrder() {
    let orderProto: Order = {
        id: '<uuid>',
        ctime: Date.now(),
        mtime: Date.now(),
        type: OrderType.Normal,
        status: OrderStatus.Created,
        customer: {
            id: 'uid',
        },
        product: {
            id: 'pid',
            type: ProductType.Normal
        }
        ,
        requirement: {
            components: []
        },
        logistics: {
            id: 'lid',
            mtime: Date.now(),
            ctime: Date.now(),
            fromLoc: '',
            toLoc: '',
            arriveTime: undefined
        }
    };

    return orderProto;
}


describe('OrderHandler(Basic lifecycle)', () => {
    let order = createOrder();
    
    it('should not change the order if no external factor was changed', async () => {
        await handleOrder(order, {
            type: 'CUSTOMER_ACK',
            payload: { resolved: false }
        });
        expect(order.status).to.equal(OrderStatus.Created);
    });
    
    it('should state the order as `CustomerAcknowledged` after customer confirm it', async () => {
        await handleOrder(order, {
            type: 'CUSTOMER_ACK',
            payload: { resolved: true }
        });
        expect(order.status).to.equal(OrderStatus.CustomerAcknowledged);
    });
        
    it('should state the order as `ProcessStarted` after certain personnel accepted it', async () => {
        await handleOrder(order, {
            type: 'PROC_UPDATE',
            payload: { success: false }
        });
        expect(order.status).to.equal(OrderStatus.ProcessStarted);
    });
    
    it('should state the order as `Finished` after finished successfully', async () => {
        await handleOrder(order, {
            type: 'PROC_UPDATE',
            payload: { success: true }
        });
        expect(order.status).to.equal(OrderStatus.DeliveryFinished);
    });
        
    it('should state the order as `Closed` after customer confirm the product and give feedback, etc.', async () => {
        await handleOrder(order, {
            type: 'ORDER_CONFIRM',
            payload: { resolved: true }
        });
        expect(order.status).to.equal(OrderStatus.Closed);
    });
});

describe('OrderHandler(Cancelling)', () => {

    it('should state the order as `Cancelled` when customer wants to discard it (before ack)', async () => {
        let order = createOrder();
        await handleOrder(order, {
            type: 'CANCEL_ORDER',
            payload: {}
        });

        expect(order.status).to.equal(OrderStatus.Cancelled);
    });

    it('should not state the order as `Cancelled` after customer ack', async () => {
        let order = createOrder();
        await handleOrder(order, {
            type: 'CUSTOMER_ACK',
            payload: { resolved: true }
        });
        try {
            await handleOrder(order, {
                type: 'CANCEL_ORDER',
                payload: {}
            });
        } catch(e) {
            expect(e).to.be.instanceOf(Error, 'Expect throws an error');
            expect(e.message).to.equal('Cannot cancel customer-acknowledged order');
        }

        expect(order.status).not.eq(OrderStatus.Cancelled);
    });
});
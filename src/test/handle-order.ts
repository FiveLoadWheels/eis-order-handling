import { handleOrder } from '../handle-order';
import { Order, OrderType, OrderStatus, ProductType, ProductStatus } from '../datatypes';
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
        products: [
            {
                id: 'pid',
                serial_number: '0x000fffabcde',
                status: ProductStatus.Initialized
            }
        ],
        requirement: [],
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
    
    it('should state the order as `ProcessStarted` after SOME order(s) being accepted by certain personnels', async () => {
        // do something should be done by handleProduct(product, action)
        order.products[0].status = ProductStatus.ComponentEnsured;
        await handleOrder(order, {
            type: 'UPDATE_PRODUCT_PROCESS',
            payload: null
        });
        expect(order.status).to.equal(OrderStatus.ProcessStarted);
    });

    it('should state the order as `ProcessFinished` after ALL orders being ready for delivering', async () => {
        // do something should be done by handleProduct(product, action)
        order.products[0].status = ProductStatus.Ready;
        await handleOrder(order, {
            type: 'UPDATE_PRODUCT_PROCESS',
            payload: null
        });
        expect(order.status).to.equal(OrderStatus.ProcessFinished);
    });

    it('should state the order as `DeliveryStarted` after logistics process started', async () => {
        await handleOrder(order, {
            type: 'START_DELIVERY',
            payload: { resolved: true }
        });
        expect(order.status).to.equal(OrderStatus.DeliveryStarted);
    });
        
    it('should state the order as `DeliveryFinished` after customer confirm the product and give feedback, etc.', async () => {
        await handleOrder(order, {
            type: 'ORDER_CONFIRM',
            payload: { resolved: true, arriveTime: Date.now() }
        });
        expect(order.status).to.equal(OrderStatus.DeliveryFinished);
    });
});


describe('OrderHandler(Basic lifecycle, if inventory exists)', () => {
    let order = createOrder();
    // state all products as `Ready` in case inventory exists for all products
    order.products[0].status = ProductStatus.Ready;
    
    it('should not change the order if no external factor was changed', async () => {
        await handleOrder(order, {
            type: 'CUSTOMER_ACK',
            payload: { resolved: false }
        });
        expect(order.status).to.equal(OrderStatus.Created);
    });
    
    it('should state the order as `ProcessFinished` after customer confirm it, if inventory exists', async () => {
        await handleOrder(order, {
            type: 'CUSTOMER_ACK',
            payload: { resolved: true }
        });
        expect(order.status).to.equal(OrderStatus.ProcessFinished);
    });
    
    it('should state the order as `DeliveryStarted` after logistics process started', async () => {
        await handleOrder(order, {
            type: 'START_DELIVERY',
            payload: { resolved: true }
        });
        expect(order.status).to.equal(OrderStatus.DeliveryStarted);
    });
        
    it('should state the order as `DeliveryFinished` after customer confirm the product and give feedback, etc.', async () => {
        await handleOrder(order, {
            type: 'ORDER_CONFIRM',
            payload: { resolved: true, arriveTime: Date.now() }
        });
        expect(order.status).to.equal(OrderStatus.DeliveryFinished);
    });
});

describe('OrderHandler(Modifying)', () => {
    let order = createOrder();
    it('should modify the order when the customer wants to modify information', async () => {
        await handleOrder(order, {
            type: 'MODIFY_ORDER',
            payload: {
                logistics: {
                    toLoc: 'A new location, Hong Kong SAR'
                }
            }
        });
        expect(order.logistics.toLoc).to.equal('A new location, Hong Kong SAR');
    });

    it('should not modify the order after the customer has comfirmed it', async () => {
        await handleOrder(order, {
            type: 'CUSTOMER_ACK',
            payload: { resolved: true }
        });
        try {
            await handleOrder(order, {
                type: 'MODIFY_ORDER',
                payload: {
                    logistics: {
                        toLoc: 'Another location, Hong Kong SAR'
                    }
                }
            })
        }
        catch (e) {
            expect(e).to.be.instanceOf(Error, 'Expect throws an error');
            expect(e.message).to.equal('Cannot modify customer-acknowledged order');
        }
        expect(order.logistics.toLoc).to.equal('A new location, Hong Kong SAR');
    })
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
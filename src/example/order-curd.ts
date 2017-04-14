import { Router } from 'express';
import { IOrder as IOrder, OrderStatus } from '../datatypes';
import { handleOrder } from '../handle-order';
import { Order } from '../orm';

// export function order() {
//     let router = Router();

//     router.put('/new', async (req, res) => {
//         let order: IOrder | null = JSON.parse(req.body);
//         if (!order) {
//             return res.json({ error: 'Order not found.' });
//         }
//         // await handleOrder(order);
//         await Order.create(order);
//         res.json({ error: null });
//     });

//     router.post('/update/:id', async (req, res) => {
//         let order: IOrder | null = await Order.findOne(req.params.id);
//         if (!order) {
//             return res.json({ error: 'Order not found.' });
//         }
//         await Order.update(await handleOrder(order, {
//             type: 'MODIFY_ORDER',
//             payload: JSON.parse(req.body)
//         }), { where: { id: order.id } });
//         res.json({ error: null });
//     });

//     router.post('/customer-confirm/:id', async (req, res) => {
//         let order: IOrder | null = await Order.findOne(req.params.id);
//         if (!order) {
//             return res.json({ error: 'Order not found.' });
//         }
//         await Order.update(await handleOrder(order, {
//             type: 'CUSTOMER_ACK',
//             payload: { resolved: true }
//         }), { where: { id: order.id } });
//         if (order.status === OrderStatus.CustomerAcknowledged) {
//             // notifyProductionDeptToAccept(order);
//         }
//         else if (order.status === OrderStatus.ProcessFinished) {
//             // notifyDeliveryDeptToProc(order);
//         }
//         res.json({ error: null });
//     });

//     router.post('/processOrder/:id', async (req, res) => {
//         let order: IOrder | null = await Order.find(req.params.id);
//         if (!order) {
//             return res.json({ error: 'Order not found.' });
//         }
//         // await Order.update(await handleOrder(order, {
//         //     type: 'PROC_UPDATE',
//         //     payload: {
//         //         type: 'INIT_PRODUCT',
//         //         payload: res.body
//         //     }
//         // }), { where: { id: order.id } });
//         res.json({ error: null });
//     });

//     router.post('/startDelivery/:id', async (req, res) => {
//         let order: IOrder | null = await Order.find(req.params.id);
//         if (!order) {
//             return res.json({ error: 'Order not found.' });
//         }
//         await Order.update(await handleOrder(order, {
//             type: 'START_DELIVERY',
//             payload: { resolved: true }
//         }), { where: { id: order.id } });
//         res.json({ error: null });
//     });

//     router.post('/finDelivery/:id', async (req, res) => {
//         let order: IOrder | null = await Order.find(req.params.id);
//         if (!order) {
//             return res.json({ error: 'Order not found.' });
//         }
//         await Order.update(await handleOrder(order, {
//             type: 'ORDER_CONFIRM',
//             payload: { resolved: true, arriveTime: Date.now() }
//         }), { where: { id: order.id } });
//         res.json({ error: null });
//     });

//     return router;
// }
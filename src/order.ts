// import { Order, OrderEvent } from './datatypes';

// export interface OrderExternals {
//     queryCustomerAck(order: Order): Promise<{
//         resolved: boolean
//     }>;

//     queryProcessStatus(order: Order): Promise<{
//         success: boolean,
//         newEvents: OrderEvent[]
//     } | null>;

//     queryUserConfirm(order: Order): Promise<{
//         resolved: boolean
//     }>;

//     saveOrder(order: Order): Promise<void>;
// }
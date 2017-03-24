
export interface Identified {
    id: string;
}

export interface TimeTraced {
    /** Create time */
    ctime: number;
    /** Modify time */ 
    mtime: number;
}

export interface Human extends Identified {

}

export interface Customer extends Human {

}

export interface Personnel extends Human {

}

export interface Order extends Identified, TimeTraced {
    type: OrderType;
    status: OrderStatus;
    // events: OrderEvent[];
    customer: Customer;
    requirement: ProductRequirement;
    product: Product;
    logistics: Logistics;
}

export enum OrderType {
    Normal
}

// 订单状态
export enum OrderStatus {
    Cancelled, // 订单已取消
    Created, // 订单已创建
    CustomerAcknowledged, // 用户已确认（支付）订单
    ProcessStarted, // 订单处理已开始（？）
    ProcessFinished, // 订单处理已结束（？）
    DeliveryStarted, // 物流分发已开始
    DeliveryFinished, // 订单已结束
    // ReturnStarted, // 退货已开始
    Closed // 
}

// export interface OrderEvent extends Identified, TimeTraced {
//     status: OrderStatus;
// }

export interface Logistics extends Identified, TimeTraced {
    fromLoc: string;
    toLoc: string;
    arriveTime?: number;
}

export interface Component extends Identified {

}

export interface ProductRequirement {
    components: Component[];

}

export interface Product extends Identified {
    type: ProductType;
}

export enum ProductType {
    Normal
}

export interface InventoryRecord {

}

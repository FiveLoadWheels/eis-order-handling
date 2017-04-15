
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

export interface IOrder extends Identified, TimeTraced {
    status: OrderStatus;
    customer: Customer;
    products: Product[];
    arriveTime: number | undefined;
    address: string;
    // logistics: Logistics;
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

export type ProductRequirement = string;

export interface Product extends Identified {
    serialNumber: string;
    order: IOrder;
    modelId: number;
    status: ProductStatus;
}

export enum ProductStatus {
    Initialized = 1, // 已根据订单生成记录
    ComponentEnsured, // 已保障零部件存货足够
    AssemblyCompleted, // 已完成组装
    Ready // also CheckCompleted，已完成质量检查，已完成生产
}

export interface InventoryRecord {

}

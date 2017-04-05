import { EndProduct, ProductStatus, ProductType } from './datatypes';

export type ProductAction =
    { type: 'CONFIRM_COMPNENT_INVENTORY', payload: any };

export function handleProduct(product: EndProduct, action: ProductAction) {

}
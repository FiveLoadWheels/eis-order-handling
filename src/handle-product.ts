import { Product, ProductStatus } from './datatypes';

export type ProductAction =
    { type: 'CONFIRM_COMPNENT_INVENTORY', payload: any };

export function handleProduct(product: Product, action: ProductAction) {

}
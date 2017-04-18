import { Product, ProductStatus } from './datatypes';

export type ProductAction =
    { type: 'UPDATE_ACCESSORY', payload: any } |
    { type: 'COMPLETE_ASSEMBLY', payload: any } |
    { type: 'PASS_CHECKING', payload: any };

export function handleProduct(product: Product, action: ProductAction) {
    switch (product.status) {
    case ProductStatus.Initialized:
        if (action.type === 'UPDATE_ACCESSORY') {
            if (product.accessories.some(acc => acc.quantity < 1)) {
                // TODO: reject accessory update
                return false;
            }
            else {
                product.accessories.forEach(acc => {
                    acc.quantity -= 1;
                });
                product.status = ProductStatus.ComponentEnsured;
                return true;
            }
        }
    break;

    case ProductStatus.ComponentEnsured:
        if (action.type === 'COMPLETE_ASSEMBLY') {
            product.status = ProductStatus.AssemblyCompleted;
            return true;
        }
    break;

    case ProductStatus.AssemblyCompleted:
        if (action.type === 'PASS_CHECKING') {
            product.status = ProductStatus.Ready;
            return true;
        }
    break;

    case ProductStatus.Ready:

    break;

    default:
        // Nothing
    }

    return false;
}
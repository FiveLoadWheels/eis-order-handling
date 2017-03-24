import * as Sequelize from 'sequelize';
import { Order as IOrder } from './datatypes';

var sequelize = new Sequelize('eis', {
    dialect: 'sqlite',
    storage: '~/eis.dat'
});

export var Order = sequelize.define<IOrder, {}>('Order', {
    id: Sequelize.UUID,
});


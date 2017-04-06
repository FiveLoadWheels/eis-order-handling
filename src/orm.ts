import * as Sequelize from 'sequelize';
import { IOrder } from './datatypes';

var sequelize = new Sequelize('eis', {
    dialect: 'sqlite',
    storage: '~/eis.dat'
});

export var Order = sequelize.define<IOrder & Sequelize.Instance<{}>, {}>('Order', {
    id: Sequelize.UUID,
});

export type Order = IOrder & Sequelize.Instance<{}>;
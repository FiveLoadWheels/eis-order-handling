import * as datatypes from './src/datatypes';

type _Datatypes = typeof datatypes;

declare namespace EIS {
    export interface Datatypes extends _Datatypes {}
}
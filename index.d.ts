import * as datatypes from './lib/datatypes';

type _Datatypes = typeof datatypes;

declare namespace EIS {
    export interface Datatypes extends _Datatypes {}
}
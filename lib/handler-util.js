// export type Action = { type: string, payload: any }
// export function handleAction<T extends string, A extends Action>(type: T, action: A, handler: (payload: typeof A.payload) => void) {
//     if (!action) {
//         return;
//     }
//     else if (typeof action.type === 'undefined') {
//         throw new Error('Invaild action');
//     }
//     else if (action.type === type) {
//         handler(action.payload);
//     }
//     else {
//         return;
//     }
// } 
//# sourceMappingURL=handler-util.js.map
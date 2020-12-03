import TypeHelper from '../utils/TypeHelper';

export interface IProceedJoinPoint<T = any> {
    target: T;
    args: Array<any>;
    proceed(...props: any[]): Promise<any>;
}

export function Around(around: Function) {
    if (!TypeHelper.isFunction) throw new Error('Around param must be string.');

    return function aroundDecorator(target: Function, methodName: string, desc: PropertyDescriptor): PropertyDescriptor {
        if (!methodName) {
            Reflect.ownKeys(target.prototype).forEach((method: string) => {
                if (method === 'constructor') return;

                const aroundMethod = aroundDecorator(target, method, Reflect.getOwnPropertyDescriptor(target.prototype, method));

                Reflect.defineProperty(target.prototype, method, aroundMethod);
            });

            return;
        }

        const { value: method, configurable, enumerable } = desc;

        return {
            configurable,
            enumerable,
            writable: true,
            value: function aspect(...args: any[]) {
                return around.call(target, { target, args, proceed: method });
            },
        };
    };
}

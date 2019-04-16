import { SetController } from './ControllerHelper';

export function Before(fn?: Function): Function {
    return function _before(target: Function, methodName: string, { value, configurable, enumerable }: PropertyDescriptor) {
        if (!fn) {
            SetController(target, methodName);
            Reflect.defineProperty(target, '__before', {
                get: function get() {
                    return Reflect.get(target, methodName).bind(this);
                },
            });
            return;
        }

        return {
            configurable,
            enumerable,
            get() {
                return async function before(...props: any[]) {
                    const beforeResult = await Promise.resolve(Reflect.apply(fn, this, []));
                    if (beforeResult === false) return;
                    return value.apply(this, props);
                }.bind(this);
            },
        };
    };
}

export function After(fn?: Function): Function {
    return function _after(target: Function, methodName: string, { value, configurable, enumerable }: PropertyDescriptor) {
        if (!fn) {
            SetController(target, methodName);
            Reflect.defineProperty(target, '__after', {
                get: function get() {
                    return Reflect.get(target, methodName).bind(this);
                },
            });
            return;
        }

        return {
            configurable,
            enumerable,
            get() {
                return async function after(...props: any[]) {
                    await Promise.resolve(Reflect.apply(value, this, props));
                    return fn.apply(this);
                }.bind(this);
            },
        };
    };
}

import { SetController } from './ControllerHelper';

function reDefineProperty(clazz: Function, methodName: string, newMethodName: string) {
    SetController(clazz, methodName);
    Reflect.defineProperty(clazz, newMethodName, {
        get: function get() {
            return Reflect.get(clazz, methodName).bind(this);
        },
    });
}

export function Before(fn?: Function): Function {
    return function _before(target: Function, methodName: string, { value, configurable, enumerable }: PropertyDescriptor) {
        if (!fn) {
            return reDefineProperty(target.constructor, methodName, '__before');
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
            return reDefineProperty(target.constructor, methodName, '__after');
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

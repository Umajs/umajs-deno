import { SetController } from './ControllerHelper';
import { interceptors } from './Interceptor';

function reDefineProperty(clazz: Function, methodName: string, newMethodName: string) {
    SetController(clazz, methodName);
    Reflect.defineProperty(clazz, newMethodName, {
        get: function get() {
            return Reflect.get(clazz, methodName).bind(this);
        },
    });
}

export function Before(interceptorName?: string): Function {
    return function _before(target: Function, methodName: string, { value, configurable, enumerable }: PropertyDescriptor) {
        if (!interceptorName) {
            return reDefineProperty(target, methodName, '__before');
        }

        return {
            configurable,
            enumerable,
            get() {
                return async function before(...props: any[]) {
                    const beforeResult = await Promise.resolve(Reflect.apply(interceptors[interceptorName], this, []));
                    if (beforeResult === false) return;
                    return value.apply(this, props);
                }.bind(this);
            },
        };
    };
}

export function After(interceptorName?: string): Function {
    return function _after(target: Function, methodName: string, { value, configurable, enumerable }: PropertyDescriptor) {
        if (!interceptorName) {
            return reDefineProperty(target, methodName, '__after');
        }

        return {
            configurable,
            enumerable,
            get() {
                return async function after(...props: any[]) {
                    await Promise.resolve(Reflect.apply(value, this, props));
                    return interceptors[interceptorName].apply(this);
                }.bind(this);
            },
        };
    };
}

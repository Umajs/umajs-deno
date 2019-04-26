import { SetController } from './ControllerHelper';

const obj: any = {};

export default new Proxy(obj, {
    get(_, key: string) {
        return function methods(...props: any[]) {
            const [target, methodName] = props;
            console.log('methods...', methodName, key);
            SetController(target.constructor, methodName, { methodType: key });
        };
    },
});

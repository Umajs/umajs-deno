import { SetController } from './ControllerHelper';

const obj: any = {};

export default new Proxy(obj, {
    get(_, key: string) {
        return function methods(...props: any[]) {
            const [target, methodName] = props;
            SetController(target.constructor, methodName, { methodType: key });
        };
    },
});

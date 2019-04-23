import { getConfig } from './Config';

export function requireDefault(p: string) {
    /* eslint-disable global-require */
    const ex = require(p);
    return (ex && (typeof ex === 'object') && 'default' in ex) ? ex.default : ex;
}

let controllerReg = null;
export function ControllerMatch(name: string) {
    if (!controllerReg) {
        const {
            controllerSuffix = '',
        } = getConfig();
        controllerReg = new RegExp(`([a-zA-Z0-9_]+)${controllerSuffix}`);
    }

    const result = name.split('.')[0].match(controllerReg);
    return result;
}

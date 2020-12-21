import { fs } from '../../node-to-deno/mod.ts';
export default class Require {
    /**
     * clear module cache
     * @param {string} modulePath
     */
    // static deleteCache(modulePath: string) {
    //     /* eslint-disable no-undef */
    //     const module: NodeModule = require.cache[modulePath];

    //     if (!module) return;

    //     if (module.parent) {
    //         module.parent.children.splice(module.parent.children.indexOf(module), 1);
    //     }

    //     if (module.children) {
    //         module.children.splice(module.children.indexOf(module), 1);
    //     }

    //     delete require.cache[modulePath];
    // }

    /**
     * require default or common default
     * @param p module path
     */
    static async default(p: string) {
        /* eslint-disable global-require */
        try {
            const ex = await import(p);

            return (ex && (typeof ex === 'object') && 'default' in ex) ? ex.default : ex;
        } catch (error) {
            console.log(`建议${p}父级目录配置ignore`);
        }
    }
}

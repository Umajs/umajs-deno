import { loadDir } from './utils';
import controllerInfo from './utils/controllerInfo';
import Require from './utils/Require';

export { default as BaseController } from './core/BaseController';

export { Path } from './decorators/Path';

export function Router({ ROOT }) {
    loadDir(ROOT, (fileName) => {
        Require.default(fileName);
    });

    for (const info of controllerInfo.getControllersInfo()) {
        console.log('》》', info);
    }

    return () => {};
}

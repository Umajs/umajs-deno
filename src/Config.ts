import * as path from 'path';

const config = {
    controllerRoot: path.resolve(process.cwd(), 'src'),
    controllerSuffix: 'Controller',
    routers: [],
};

export const setConfig = (cfg: any) => {
    Object.assign(config, cfg);
};

export const getConfig = () => config;

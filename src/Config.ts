import * as path from 'path';

const config = {
    controllerPath: path.resolve(process.cwd(), 'src/controller'),
    aopPath: null, // path.resolve(process.cwd(), 'src/aop'),
    controllerSuffix: 'Controller',
    routers: [],
};

export const setConfig = (cfg: any) => {
    Object.assign(config, cfg);
};

export const getConfig = () => config;

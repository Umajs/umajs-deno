import * as path from 'path';

const config = {
    controllerPath: path.resolve(process.cwd(), 'src/controller'),
    interceptorPath: path.resolve(process.cwd(), 'src/interceptor'),
    controllerSuffix: 'Controller',
    routers: [],
};

export const setConfig = (cfg: any) => {
    Object.assign(config, cfg);
};

export const getConfig = () => config;

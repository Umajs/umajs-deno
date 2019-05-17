import { controllers } from '../src/index';

enum Method {
    GET,
    POST,
    PUT,
    OPTION,
    HEAD,
    DELETE,
    TRACE,
    CONNECT,
}

export default [
    [['/hehe', '/hehe/:haha'], controllers.index.hehe, Method.GET],
    [['/heihei'], '/index/hehe', Method.GET],
    [['/heiheihei'], '/index/hehe', [Method.GET, Method.POST]],
];

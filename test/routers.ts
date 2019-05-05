import { controllers } from '../src/index';

enum Method {
    GET,
    POST,
    DELETE,
    PUT,
    OPTION,
    UPDATE,
}

export default [
    [['/hehe', '/hehe/:haha'], controllers.index.hehe, Method.GET],
    [['/heihei'], '/index/hehe', Method.GET],
    [['/heiheihei'], '/index/hehe', [Method.GET, Method.POST]],
];

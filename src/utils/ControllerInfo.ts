import { throwError } from "./index.ts";
import BaseController from "../core/BaseController.ts";
import {
  TControllerInfo,
  TControllerInfoHelper,
  TMethodInfo,
  TPath,
} from "../typings/TControllerInfo.ts";

const ControllerMap: Map<Function, TControllerInfo> = new Map();

export default class {
  /**
     * set controller info
     * @param clazzName controller name
     * @param methodName controller method name
     * @param info controller info
     */
  static setControllersInfo(
    clazz: Function,
    methodName: string | null,
    info: TControllerInfoHelper = {},
  ) {
    throwError(
      !(clazz.prototype instanceof BaseController),
      'Decorator "Path" & "ArgDecorator" only use on class extends BaseController.',
    );

    const clazzInfo: TControllerInfo = ControllerMap.get(clazz) || {};

    /**
         * 获取需要设置或更新的字段
         * rootpath: controller visit path
         * mpath: controller method visit path
         * methodType: controller method visit method type get|post...
         * inside: controller method is private
         */
    const { root, path, methodTypes = [], argProps, argIndex, argDecorator } =
      info;

    if (root) clazzInfo.root = root;

    if (methodName) {
      const methodMap: Map<string, TMethodInfo> = clazzInfo.methodMap ||
        new Map();
      const methodInfo: TMethodInfo = methodMap.get(methodName) || {
        args: [],
        paths: [],
      };

      methodInfo.name = methodName;

      if (path) {
        const pathObj: TPath = { path };

        if (methodTypes.length > 0) pathObj.methodTypes = methodTypes;

        methodInfo.paths!.push(pathObj);
      }

      if (argDecorator) {
        methodInfo.args!.push({
          argDecorator,
          argProps,
          argIndex,
        });
      }

      methodMap.set(methodName, methodInfo);
      clazzInfo.methodMap = methodMap;
    }

    ControllerMap.set(clazz, { clazz, ...clazzInfo });
  }

  static getControllersInfo(): IterableIterator<TControllerInfo> {
    return ControllerMap.values();
  }

  static get(clazz: Function) {
    return ControllerMap.get(clazz);
  }
}

export default class TypeHelper {
  static type(target: any): string {
    return Object.prototype.toString.call(target).slice(8, -1);
  }

  static get undef(): undefined {
    return ((undef) => undef)();
  }

  static isUndef(obj: any): obj is undefined {
    return obj === TypeHelper.undef;
  }

  static isString(target: any): target is string {
    return TypeHelper.type(target) === "String";
  }

  static isObject(target: any): target is object {
    return TypeHelper.type(target) === "Object";
  }

  static isFunction(target: any): target is Function {
    return typeof target === "function";
  }

  static isBoolean(target: any): target is boolean {
    return TypeHelper.type(target) === "Boolean";
  }

  static isArray(target: any): target is [] {
    return TypeHelper.type(target) === "Array";
  }
}

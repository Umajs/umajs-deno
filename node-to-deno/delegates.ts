export class Delegator {
  protected proto: any;
  protected target: any;

  constructor(proto: any, target: any) {
    this.proto = proto;
    this.target = target;
  }

  public static create(proto: any, target: any) {
    return new Delegator(proto, target);
  }

  getter(name: string) {
    let proto = this.proto;
    let target = this.target;
    Object.defineProperty(proto, name, {
      value: target[name],
    });

    return this;
  }

  access(name: string) {
    let proto = this.proto;
    let target = this.target;
    Object.defineProperty(proto, name, {
      set(value) {
        target[name] = value;
      },
      get() {
        return target[name];
      },
    });

    return this;
  }

  method(name: string) {
    let proto = this.proto;
    let target = this.target;
    proto[name] = function () {
      return target[name].apply(target, arguments);
    };

    return this;
  }
}

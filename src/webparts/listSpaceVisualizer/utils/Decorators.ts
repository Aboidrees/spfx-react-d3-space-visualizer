

export function select(): PropertyDecorator {
  // console.log("select(): evaluated");
  const sym: symbol = Symbol.for("select");
  return function (target: Object, propertyKey: string): void {
    const currentValue: string = target[sym];
    let newValue: string = currentValue !== undefined ? currentValue + "," + propertyKey : propertyKey;
    target[sym] = newValue;
    // console.log("select(): called");
    // console.log(target);
    // console.log(propertyKey);
  };
}

export function expand(expandName: string): PropertyDecorator {
  // console.log("expand(): evaluated");
  const sym: symbol = Symbol.for("expand");
  return function (target: Object, propertyKey: string): void {
    const currentValue: string = target[sym];
    let newValue: string = currentValue !== undefined ? currentValue + "," + expandName : expandName;
    target[sym] = newValue;
    // console.log("expand(): called");
    // console.log(target);
    // console.log(propertyKey);
  };
}


export function annotation(tag: string): PropertyDecorator {
  console.log("annotation(): evaluated");
  return function (target: Object, propertyKey: string): void {
    const sym: symbol = Symbol(tag);
    target[sym] = true;
    console.log("annotation(): called");
    console.log(target);
    console.log(propertyKey);
  };
}

export function logProperty(target: Object, key: string): void {
  // property value
  var _val: any = target[key];

  // property getter
  var getter = function () {
    console.log(`Get: ${key} => ${_val}`);
    return _val;
  };

  // property setter
  var setter = function (newVal) {
    console.log(`Set: ${key} => ${newVal}`);
    _val = newVal;
  };

  // delete property.
  if (delete target[key]) {

    // create new property with getter and setter
    Object.defineProperty(target, key, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true
    });
  }
}

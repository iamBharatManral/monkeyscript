import { argumentMismatchError, argumentNotSupportedError } from "../frontend/error";
import { ArrayO, BuiltinFunctionO, IntegerO, MObject, NullO, ObjectType, StringO } from "./object";

export const builtins: Record<string, MObject> = {
  len: new BuiltinFunctionO(function(...args: Array<MObject>): MObject {
    if (args.length > 1) {
      return argumentMismatchError(1, args.length)
    }
    switch (args[0].type()) {
      case ObjectType.STRING_OBJ:
        return new IntegerO((args[0] as StringO).value.length)
      case ObjectType.ARRAY_OBJ:
        return new IntegerO((args[0] as ArrayO).elements.length)
      default:
        return argumentNotSupportedError("len", ObjectType.STRING_OBJ, args[0].type())
    }
  }),
  first: new BuiltinFunctionO(function(...args: Array<MObject>): MObject {
    if (args.length !== 1) {
      return argumentMismatchError(1, args.length)
    }

    if (args[0].type() !== ObjectType.ARRAY_OBJ) {
      return argumentNotSupportedError("first", ObjectType.ARRAY_OBJ, args[0].type())
    }

    const objArr = args[0] as ArrayO;
    if (objArr.elements.length > 0) {
      return objArr.elements[0]
    }
    return new NullO()
  }),

  last: new BuiltinFunctionO(function(...args: Array<MObject>): MObject {
    if (args.length !== 1) {
      return argumentMismatchError(1, args.length)
    }

    if (args[0].type() !== ObjectType.ARRAY_OBJ) {
      return argumentNotSupportedError("last", ObjectType.ARRAY_OBJ, args[0].type())
    }

    const objArr = args[0] as ArrayO;
    const length = objArr.elements.length;
    if (length > 0) {
      return objArr.elements[length - 1]
    }
    return new NullO()
  }),

  rest: new BuiltinFunctionO(function(...args: Array<MObject>): MObject {
    if (args.length !== 1) {
      return argumentMismatchError(1, args.length)
    }

    if (args[0].type() !== ObjectType.ARRAY_OBJ) {
      return argumentNotSupportedError("rest", ObjectType.ARRAY_OBJ, args[0].type())
    }

    const objArr = args[0] as ArrayO;
    const length = objArr.elements.length;
    if (length > 0) {
      return new ArrayO(objArr.elements.slice(1))
    }
    return new NullO()
  }),

  push: new BuiltinFunctionO(function(...args: Array<MObject>): MObject {
    if (args.length !== 2) {
      return argumentMismatchError(2, args.length)
    }

    if (args[0].type() !== ObjectType.ARRAY_OBJ) {
      return argumentNotSupportedError("push", ObjectType.ARRAY_OBJ, args[0].type())
    }

    const objArr = args[0] as ArrayO;
    return new ArrayO([...objArr.elements, args[1]])
  })
}

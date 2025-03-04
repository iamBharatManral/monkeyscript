import { argumentMismatchError, argumentNotSupportedError } from "../frontend/error";
import { BuiltinFunctionO, IntegerO, MObject, ObjectType, StringO } from "./object";

export const builtins: Record<string, MObject> = {
  len: new BuiltinFunctionO(function(...args: Array<MObject>): MObject {
    if (args.length > 1) {
      return argumentMismatchError(1, args.length)
    }
    switch (args[0].type()) {
      case ObjectType.STRING_OBJ:
        return new IntegerO((args[0] as StringO).value.length)
      default:
        return argumentNotSupportedError("len", ObjectType.STRING_OBJ, args[0].type())
    }
  })
}

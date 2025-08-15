import { Transform, TransformFnParams } from "class-transformer";

export const Trim = () => Transform(({value}: TransformFnParams) => value?.trim());
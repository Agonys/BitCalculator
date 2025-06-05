type IsStringLiteral<T> = T extends string
  ? string extends T
    ? false // it's just 'string', not a literal
    : true // it's a literal union
  : false;

export type FormifyAllowEmptyStrings<T> =
  T extends Array<infer U>
    ? Array<FormifyAllowEmptyStrings<U>>
    : T extends object
      ? {
          [K in keyof T]: FormifyAllowEmptyStrings<T[K]>;
        }
      : T extends number
        ? T | ''
        : IsStringLiteral<T> extends true
          ? T | ''
          : T;

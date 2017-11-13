// @flow
export const ize = (n: number) => (r: ({ [string]: any }) => { [string]: any }) => (...argsOuter) => (f: ({ [string]: any }) => { [string]: any }) => (...argsInner) => {
  const primo = f(...argsInner.slice(n));
  return {
    ...primo,
    meta: {
      ...(primo.meta ? primo.meta : {}),
      ...r(...argsInner.slice(0, n), ...argsOuter, primo),
    },
  }
}

export const Ize = (...args) => args.reduce((a,b) => b(a));

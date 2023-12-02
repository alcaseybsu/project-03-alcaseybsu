import _ from "lodash";

/**
 *
 * @param value value that will resolve after delay. If value is a function, will be called after delay
 * @param minDelay minimum time to delay
 * @param maxDelay maximum time to delay
 * @returns A Promise that resolves to value or value()
 */
export function promiseDelay<T>(
  value: Promise<T>,
  minDelay = 300,
  maxDelay = 1400,
): Promise<T> {
  return new Promise<T>((resolve) => {
    _.delay(() => {
      resolve(value);
    }, _.random(minDelay, maxDelay));
  });
}

export function cycle<T>(array: T[], current?: T): T {
  if (current === undefined) {
    return array[0];
  } else {
    const index = array.findIndex((item) => item === current);
    if (index === undefined || index === array.length - 1) {
      return array[0];
    } else {
      return array[index + 1];
    }
  }
}

type HasId = {
  id: string;
};

export function addId(idList: string[], id: string): string[] {
  // add unique id by first removing it if it exists.
  return push(removeId(idList, id), id);
}

export function removeId(idList: string[], id: string): string[] {
  return idList.filter((item) => item !== id);
}

export function remove<T extends HasId>(array: T[], id: string): T[] {
  return array.filter((item) => item.id !== id);
}

export function replaceIn<T extends HasId>(array: T[], value: T): T[] {
  return array.map((item) => (item.id === value.id ? value : item));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function replace<T extends Record<string, any>, U>(
  obj: T,
  field: keyof T,
  value: U,
): T {
  return {
    ...obj,
    [field]: value,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function update<T extends Record<string, any>>(
  obj: T,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updates: Record<string, any>,
): T {
  return {
    ...obj,
    ...updates,
  };
}

export function push<T>(array: T[], value: T): T[] {
  return [...array, value];
}

export function choose<T>(array: T[]): T {
  return array[_.random(array.length - 1)];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function json(data: any): string {
  return JSON.stringify(data, undefined, 2);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function jsonhtml(data: any): string {
  return `<pre>${json(data)}</pre>`;
}

// Create a new type but make all of the properties optional
export type AllOptional<Type> = {
  [Property in keyof Type]?: Type[Property];
};

export function range(startOrEnd: number, end?: number): number[] {
  if (end) {
    return Array.from({ length: end - startOrEnd }, (v, i) => startOrEnd + i);
  } else {
    return Array.from({ length: startOrEnd }, (v, i) => i);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function assert(assertion: boolean, msg?: any, ...args: any[]) {
  console.assert(assertion, msg, ...args);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function log(...data: any[]) {
  console.log(`${ts()}:`, ...data);
}

export function rand(n = 2) {
  return (Math.random() * 10 ** n).toFixed().toString().padStart(2, "0");
}

export function ts(
  {
    hours,
    minutes,
    seconds,
    ms,
  }: {
    hours: boolean;
    minutes: boolean;
    seconds: boolean;
    ms: boolean;
  } = {
    hours: false,
    minutes: false,
    seconds: true,
    ms: true,
  },
) {
  const timestamp = new Date();
  let result = "";
  if (hours) {
    if (result) {
      result += ":";
    }
    result += timestamp.getHours().toString().padStart(2, "0");
  }
  if (minutes) {
    if (result) {
      result += ":";
    }
    result += timestamp.getMinutes().toString().padStart(2, "0");
  }
  if (seconds) {
    if (result) {
      result += ":";
    }
    result += timestamp.getSeconds().toString().padStart(2, "0");
  }
  if (ms) {
    if (result) {
      result += ".";
    }
    result += timestamp.getMilliseconds().toString().padStart(3, "0");
  }
  return result;
}

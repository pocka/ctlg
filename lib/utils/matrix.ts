/**
 * Test matrix. Internal use only.
 * Each field's value is an array of possible values.
 * @private
 */
export interface Matrix {
  [key: string]: unknown[];
}

/**
 * A possible combination of the matrix fields.
 */
export type Instance<T extends Matrix> = {
  [K in keyof T]: T[K][number];
};

/**
 * Takes a matrix and returns every possible combination.
 * @param matrix
 * @returns Every combination of the matrix
 */
export function enumerate<T extends Matrix>(matrix: T): Instance<T>[] {
  return enumerateEntries(Object.entries(matrix)).map<Instance<T>>(
    (entries) => Object.fromEntries(entries) as Instance<T>,
  );
}

// Just for readability.
type ObjectEntry<T> = readonly [string, T];

// Recursive function that actually enumerates combinations.
function enumerateEntries<T>(entries: ObjectEntry<T[]>[]): ObjectEntry<T>[][] {
  if (!entries[0]) {
    return [];
  }

  const [key, values] = entries[0];
  const children = enumerateEntries<T>(entries.slice(1));

  return values
    .map((value) => {
      return children.length > 0
        ? children.map((child) => [[key, value] as const, ...child])
        : [[[key, value] as const]];
    })
    .flat();
}

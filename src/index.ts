"use strict";

export function searchInObjectFields(
  obj: unknown,
  callback: (value: unknown, path: string[], parent: unknown) => boolean,
  filter?: (value: unknown, path: string[], parent: unknown) => boolean,
  maxDepth?: number
) {
  if (typeof obj !== "object" || obj === null) {
    return;
  }

  if (maxDepth !== undefined && maxDepth <= 0) {
    return;
  }

  const root = obj as Record<string, unknown>;

  let queueOfPaths: string[][] = [];
  for (let key in root) {
    queueOfPaths.push([key]);
  }

  while (queueOfPaths.length > 0) {
    const path = queueOfPaths.shift();
    if (path === undefined) {
      continue;
    }

    const current = getFieldByPath(root, path);
    const parent = getFieldByPath(root, path.slice(0, path.length - 1));

    // Match check
    if (callback(current, path, parent)) {
      return;
    }

    // Skip filtered items
    if (filter?.(current, path, parent)) {
      continue;
    }

    // Depth check
    if (maxDepth !== undefined && path.length >= maxDepth) {
      continue;
    }

    // Type check, non-objects will be skipped
    if (typeof current !== "object" || current === null) {
      continue;
    }

    // Add nested object keys to the queue
    for (let key in current) {
      queueOfPaths.push([...path, key]);
    }
  }
}

export function getFieldByPath(obj: Record<string, unknown>, path: string[]) {
  let current: unknown = obj;
  for (let i = 0; i < path.length; i++) {
    if (typeof current === "object" && current !== null && path[i] in current) {
      current = (current as Record<string, unknown>)[path[i]];
    }
  }
  return current;
}

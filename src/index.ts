"use strict";

/**
 * Performs a deep traversal of object fields with support for conditional matching, optional filtering and optional depth limitation.
 *
 * @param {unknown} obj -
 * The object to traverse.
 * @param {(value: unknown, path: string[], parent: Record<string, unknown>) => boolean} callback -
 * A function called for each field. If it returns true, traversal stops.
 * @param {(value: unknown, path: string[], parent: Record<string, unknown>) => boolean} [filter] -
 * An optional function to skip certain fields. If it returns true, the field is skipped.
 * @param {number} [maxDepth] -
 * Optional maximum depth of traversal. If set, traversal stops at this depth.
 * @returns {void}
 */

export function searchInObjectFields(
  obj: unknown,
  callback: (
    value: unknown,
    path: string[],
    parent: Record<string, unknown>
  ) => boolean,
  filter?: (
    value: unknown,
    path: string[],
    parent: Record<string, unknown>
  ) => boolean,
  maxDepth?: number
) {
  if (typeof obj !== "object" || obj === null) {
    return;
  }

  if (maxDepth !== undefined && maxDepth <= 0) {
    return;
  }

  const root = obj as Record<string, unknown>;

  let queue: [string[], Record<string, unknown>][] = [];
  for (let key in root) {
    queue.push([[key], root]);
  }

  const visited = new Set();
  visited.add(root);

  for (let i = 0; i < queue.length; i++) {
    const path = queue[i][0];

    const parent = queue[i][1] as Record<string, unknown>;
    const current = parent[path[path.length - 1]];

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

    // Cyclic reference check
    if (visited.has(current)) {
      continue;
    }
    visited.add(current);

    // Add nested object keys to the queue
    for (let key in current) {
      queue.push([[...path, key], current as Record<string, unknown>]);
    }
  }
}

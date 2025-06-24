# searchInObjectFields

**searchInObjectFields** is a lightweight TypeScript utility for deep traversal of object fields with support for conditional matching, optional filtering and optional depth limitation.  
It’s ideal for data inspection tools, form parsers, and utility libraries that work with object structures.

## Features

- Iterates over fields in deeply nested objects
- Accepts a callback to react to specific values
- Optional filter function to skip fields or branches
- Supports maximum depth to limit traversal
- Provides path and parent information for every value
- Safe handling of non-object values

## Technologies Used

- JavaScript
- TypeScript
- Git
- Mocha
- Sinon
- Webpack

## Example

```ts
const data = {
  user: {
    name: "Alice",
    contact: {
      address: "1234 Example Str",
      phone: "123-456",
    },
  },
  meta: {
    version: "1.0",
    active: true,
  },
};

const callback = (value, path, parent) => {
  if (value === "123-456") {
    console.log("Match found at path:", path.join("."));
    console.log("Parent object:", parent);
    return true; // Stop traversal
  }
  return false;
};

const filter = (value, path, parent) => {
  if (path.includes("meta")) {
    return true; // Skip nested fields
  }
};

searchInObjectFields(
  data,
  callback, // Find "123-456" value
  filter, // Skip fields under "meta"
  3 // Maximum depth
);

/*
Match found at path: user.contact.phone
Parent object: {address: '1234 Example Str', phone: '123-456'}
*/
```

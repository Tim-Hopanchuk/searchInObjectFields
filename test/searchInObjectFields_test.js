const assert = require("assert");
const sinon = require("sinon");
const { searchInObjectFields } = require("../dist/index");

describe("basic behavior", function () {
  const obj = {
    a: "a",
    b: {
      a: "ba",
    },
    c: {
      a: "ca",
      b: {
        a: "cba",
        b: "cbb",
      },
      c: "cc",
    },
    d: "d",
  };

  it("finds 'a' at root level [a]", function () {
    const callback = sinon.spy((value, path, parent) => {
      if (value === "a") {
        return true;
      } else {
        return false;
      }
    });

    searchInObjectFields(obj, callback);

    assert.equal(callback.called, true);
    assert.equal(
      callback.getCalls().filter((call) => call.returnValue === true).length,
      1
    );
    assert.equal(callback.lastCall.returnValue, true);

    assert.equal(callback.lastCall.args[0], "a");
    assert.deepEqual(callback.lastCall.args[1], ["a"]);
    const parent = {
      a: "a",
      b: {
        a: "ba",
      },
      c: {
        a: "ca",
        b: {
          a: "cba",
          b: "cbb",
        },
        c: "cc",
      },
      d: "d",
    };
    assert.deepEqual(callback.lastCall.args[2], parent);
  });

  it("finds 'ba' at path [b.a]", function () {
    const callback = sinon.spy((value, path, parent) => {
      if (value === "ba") {
        return true;
      } else {
        return false;
      }
    });

    searchInObjectFields(obj, callback);

    assert.equal(callback.called, true);
    assert.equal(
      callback.getCalls().filter((call) => call.returnValue === true).length,
      1
    );
    assert.equal(callback.lastCall.returnValue, true);

    assert.equal(callback.lastCall.args[0], "ba");
    assert.deepEqual(callback.lastCall.args[1], ["b", "a"]);
    const parent = {
      a: "ba",
    };
    assert.deepEqual(callback.lastCall.args[2], parent);
  });

  it("finds 'ca' at path [c.a]", function () {
    const callback = sinon.spy((value, path, parent) => {
      if (value === "ca") {
        return true;
      } else {
        return false;
      }
    });

    searchInObjectFields(obj, callback);

    assert.equal(callback.called, true);
    assert.equal(
      callback.getCalls().filter((call) => call.returnValue === true).length,
      1
    );
    assert.equal(callback.lastCall.returnValue, true);

    assert.equal(callback.lastCall.args[0], "ca");
    assert.deepEqual(callback.lastCall.args[1], ["c", "a"]);
    const parent = {
      a: "ca",
      b: {
        a: "cba",
        b: "cbb",
      },
      c: "cc",
    };
    assert.deepEqual(callback.lastCall.args[2], parent);
  });

  it("finds 'cba' at path [c.b.a]", function () {
    const callback = sinon.spy((value, path, parent) => {
      if (value === "cba") {
        return true;
      } else {
        return false;
      }
    });

    searchInObjectFields(obj, callback);

    assert.equal(callback.called, true);
    assert.equal(
      callback.getCalls().filter((call) => call.returnValue === true).length,
      1
    );
    assert.equal(callback.lastCall.returnValue, true);

    assert.equal(callback.lastCall.args[0], "cba");
    assert.deepEqual(callback.lastCall.args[1], ["c", "b", "a"]);
    const parent = {
      a: "cba",
      b: "cbb",
    };
    assert.deepEqual(callback.lastCall.args[2], parent);
  });

  it("finds 'cbb' at path [c.b.b]", function () {
    const callback = sinon.spy((value, path, parent) => {
      if (value === "cbb") {
        return true;
      } else {
        return false;
      }
    });

    searchInObjectFields(obj, callback);

    assert.equal(callback.called, true);
    assert.equal(
      callback.getCalls().filter((call) => call.returnValue === true).length,
      1
    );
    assert.equal(callback.lastCall.returnValue, true);

    assert.equal(callback.lastCall.args[0], "cbb");
    assert.deepEqual(callback.lastCall.args[1], ["c", "b", "b"]);
  });

  it("finds 'cc' at path [c.c]", function () {
    const callback = sinon.spy((value, path, parent) => {
      if (value === "cc") {
        return true;
      } else {
        return false;
      }
    });

    searchInObjectFields(obj, callback);

    assert.equal(callback.called, true);
    assert.equal(
      callback.getCalls().filter((call) => call.returnValue === true).length,
      1
    );
    assert.equal(callback.lastCall.returnValue, true);

    assert.equal(callback.lastCall.args[0], "cc");
    assert.deepEqual(callback.lastCall.args[1], ["c", "c"]);
    const parent = {
      a: "ca",
      b: {
        a: "cba",
        b: "cbb",
      },
      c: "cc",
    };
    assert.deepEqual(callback.lastCall.args[2], parent);
  });

  it("finds 'd' at root level [d]", function () {
    const callback = sinon.spy((value, path, parent) => {
      if (value === "d") {
        return true;
      } else {
        return false;
      }
    });

    searchInObjectFields(obj, callback);

    assert.equal(callback.called, true);
    assert.equal(
      callback.getCalls().filter((call) => call.returnValue === true).length,
      1
    );
    assert.equal(callback.lastCall.returnValue, true);

    assert.equal(callback.lastCall.args[0], "d");
    assert.deepEqual(callback.lastCall.args[1], ["d"]);
    const parent = {
      a: "a",
      b: {
        a: "ba",
      },
      c: {
        a: "ca",
        b: {
          a: "cba",
          b: "cbb",
        },
        c: "cc",
      },
      d: "d",
    };
    assert.deepEqual(callback.lastCall.args[2], parent);
  });
});

describe("filter behavior", function () {
  const obj = {
    a: "a",
    b: {
      a: "ba",
    },
    c: {
      a: "ca",
      b: {
        a: "cba",
        b: "cbb",
      },
      c: "cc",
    },
    d: "d",
  };

  it("processes 'a' despite filter skipping 'с' branch", function () {
    const callback = sinon.spy((value, path, parent) => {
      if (value === "a") {
        return true;
      } else {
        return false;
      }
    });

    const filter = sinon.spy((value, path, parent) => {
      if (path.includes("с")) {
        return true;
      } else {
        return false;
      }
    });

    searchInObjectFields(obj, callback, filter);

    assert.equal(callback.called, true);
    assert.equal(
      callback.getCalls().filter((call) => call.returnValue === true).length,
      1
    );
    assert.equal(callback.lastCall.returnValue, true);

    assert.equal(callback.lastCall.args[0], "a");
    assert.deepEqual(callback.lastCall.args[1], ["a"]);
    const parent = {
      a: "a",
      b: {
        a: "ba",
      },
      c: {
        a: "ca",
        b: {
          a: "cba",
          b: "cbb",
        },
        c: "cc",
      },
      d: "d",
    };
    assert.deepEqual(callback.lastCall.args[2], parent);
  });

  it("skips 'ba' because filter skips path containing 'b'", function () {
    const callback = sinon.spy((value, path, parent) => {
      if (value === "ba") {
        return true;
      } else {
        return false;
      }
    });

    const filter = sinon.spy((value, path, parent) => {
      if (path.includes("b")) {
        return true;
      } else {
        return false;
      }
    });

    searchInObjectFields(obj, callback, filter);

    assert.equal(callback.called, true);
    assert.equal(
      callback.getCalls().filter((call) => call.returnValue === true).length,
      0
    );
  });

  it("processes 'ca' but skips nested fields", function () {
    const callback = sinon.spy((value, path, parent) => {
      if (value === "ca") {
        return true;
      } else {
        return false;
      }
    });

    const filter = sinon.spy((value, path, parent) => {
      if (path.includes("a")) {
        return true;
      } else {
        return false;
      }
    });

    searchInObjectFields(obj, callback, filter);

    assert.equal(callback.called, true);
    assert.equal(
      callback.getCalls().filter((call) => call.returnValue === true).length,
      1
    );
    assert.equal(callback.lastCall.returnValue, true);

    assert.equal(callback.lastCall.args[0], "ca");
    assert.deepEqual(callback.lastCall.args[1], ["c", "a"]);
    const parent = {
      a: "ca",
      b: {
        a: "cba",
        b: "cbb",
      },
      c: "cc",
    };
    assert.deepEqual(callback.lastCall.args[2], parent);
  });

  it("skips 'cba' because filter skips path containing 'b'", function () {
    const callback = sinon.spy((value, path, parent) => {
      if (value === "cba") {
        return true;
      } else {
        return false;
      }
    });

    const filter = sinon.spy((value, path, parent) => {
      if (path.includes("b")) {
        return true;
      } else {
        return false;
      }
    });

    searchInObjectFields(obj, callback, filter);

    assert.equal(callback.called, true);
    assert.equal(
      callback.getCalls().filter((call) => call.returnValue === true).length,
      0
    );
  });
});

describe("depth limit", function () {
  const obj = {
    a: "a",
    b: {
      a: "ba",
    },
    c: {
      a: "ca",
      b: {
        a: "cba",
        b: "cbb",
      },
      c: "cc",
    },
    d: "d",
  };

  it("skips all when maxDepth is 0", function () {
    const callback = sinon.spy((value, path, parent) => {
      if (value === "a") {
        return true;
      } else {
        return false;
      }
    });

    const filter = sinon.spy((value, path, parent) => {
      return false;
    });

    searchInObjectFields(obj, callback, filter, 0);

    assert.equal(callback.called, false);
  });

  it("skips 'ba' when maxDepth is 1", function () {
    const callback = sinon.spy((value, path, parent) => {
      if (value === "ba") {
        return true;
      } else {
        return false;
      }
    });

    const filter = sinon.spy((value, path, parent) => {
      return false;
    });

    searchInObjectFields(obj, callback, filter, 1);

    assert.equal(callback.called, true);
    assert.equal(
      callback.getCalls().filter((call) => call.returnValue === true).length,
      0
    );
  });

  it("finds 'ca' when maxDepth is 2", function () {
    const callback = sinon.spy((value, path, parent) => {
      if (value === "ca") {
        return true;
      } else {
        return false;
      }
    });

    const filter = sinon.spy((value, path, parent) => {
      return false;
    });

    searchInObjectFields(obj, callback, filter, 2);

    assert.equal(callback.called, true);
    assert.equal(
      callback.getCalls().filter((call) => call.returnValue === true).length,
      1
    );
    assert.equal(callback.lastCall.returnValue, true);

    assert.equal(callback.lastCall.args[0], "ca");
    assert.deepEqual(callback.lastCall.args[1], ["c", "a"]);
    const parent = {
      a: "ca",
      b: {
        a: "cba",
        b: "cbb",
      },
      c: "cc",
    };
    assert.deepEqual(callback.lastCall.args[2], parent);
  });

  it("skips 'cba' when maxDepth is 2", function () {
    const callback = sinon.spy((value, path, parent) => {
      if (value === "cba") {
        return true;
      } else {
        return false;
      }
    });

    const filter = sinon.spy((value, path, parent) => {
      return false;
    });

    searchInObjectFields(obj, callback, filter, 2);

    assert.equal(callback.called, true);
    assert.equal(
      callback.getCalls().filter((call) => call.returnValue === true).length,
      0
    );
  });

  it("finds 'cbb' when maxDepth is large enough", function () {
    const callback = sinon.spy((value, path, parent) => {
      if (value === "cbb") {
        return true;
      } else {
        return false;
      }
    });

    const filter = sinon.spy((value, path, parent) => {
      return false;
    });

    searchInObjectFields(obj, callback, filter, 15);

    assert.equal(callback.called, true);
    assert.equal(
      callback.getCalls().filter((call) => call.returnValue === true).length,
      1
    );
    assert.equal(callback.lastCall.returnValue, true);

    assert.equal(callback.lastCall.args[0], "cbb");
    assert.deepEqual(callback.lastCall.args[1], ["c", "b", "b"]);
  });

  it("skips all when maxDepth is negative", function () {
    const callback = sinon.spy((value, path, parent) => {
      if (value === "cc") {
        return true;
      } else {
        return false;
      }
    });

    const filter = sinon.spy((value, path, parent) => {
      return false;
    });

    searchInObjectFields(obj, callback, filter, -5);

    assert.equal(callback.called, false);
  });
});

describe("array handling", function () {
  it("finds 'ab' in nested array at path [a.1]", function () {
    const obj = {
      a: ["aa", "ab", "ac"],
      b: {
        a: "ba",
      },
      c: {
        a: "ca",
        b: {
          a: "cba",
          b: "cbb",
        },
        c: "cc",
      },
      d: "d",
    };

    const callback = sinon.spy((value, path, parent) => {
      if (value === "ab") {
        return true;
      } else {
        return false;
      }
    });

    searchInObjectFields(obj, callback);

    assert.equal(callback.called, true);
    assert.equal(
      callback.getCalls().filter((call) => call.returnValue === true).length,
      1
    );
    assert.equal(callback.lastCall.returnValue, true);

    assert.equal(callback.lastCall.args[0], "ab");
    assert.deepEqual(callback.lastCall.args[1], ["a", "1"]);
    const parent = ["aa", "ab", "ac"];
    assert.deepEqual(callback.lastCall.args[2], parent);
  });

  it("finds 'cbc' in nested array at path [c.b.a.2]", function () {
    const obj = {
      a: "a",
      b: {
        a: "ba",
      },
      c: {
        a: "ca",
        b: {
          a: ["cba", "cbb", "cbc"],
          b: "cbb",
        },
        c: "cc",
      },
      d: "d",
    };

    const callback = sinon.spy((value, path, parent) => {
      if (value === "cbc") {
        return true;
      } else {
        return false;
      }
    });

    searchInObjectFields(obj, callback);

    assert.equal(callback.called, true);
    assert.equal(
      callback.getCalls().filter((call) => call.returnValue === true).length,
      1
    );
    assert.equal(callback.lastCall.returnValue, true);

    assert.equal(callback.lastCall.args[0], "cbc");
    assert.deepEqual(callback.lastCall.args[1], ["c", "b", "a", "2"]);
    const parent = ["cba", "cbb", "cbc"];
    assert.deepEqual(callback.lastCall.args[2], parent);
  });

  it("finds 'ba1a' in nested array of objects at path [b.a.1.a]", function () {
    const obj = {
      a: "a",
      b: {
        a: [
          { a: "ba0a", b: "ba0b" },
          { a: "ba1a", b: "ba1b" },
        ],
      },
      c: {
        a: "ca",
        b: {
          a: "cba",
          b: "cbb",
        },
        c: "cc",
      },
      d: "d",
    };

    const callback = sinon.spy((value, path, parent) => {
      if (value === "ba1a") {
        return true;
      } else {
        return false;
      }
    });

    searchInObjectFields(obj, callback);

    assert.equal(callback.called, true);
    assert.equal(
      callback.getCalls().filter((call) => call.returnValue === true).length,
      1
    );
    assert.equal(callback.lastCall.returnValue, true);

    assert.equal(callback.lastCall.args[0], "ba1a");
    assert.deepEqual(callback.lastCall.args[1], ["b", "a", "1", "a"]);
    const parent = { a: "ba1a", b: "ba1b" };
    assert.deepEqual(callback.lastCall.args[2], parent);
  });
});

describe("invalid input handling", function () {
  it("ignores non-object input: number", function () {
    const obj = 5;
    const callback = sinon.spy((value, path, parent) => {
      return true;
    });

    searchInObjectFields(obj, callback);

    assert.equal(callback.called, false);
  });

  it("ignores non-object input: string", function () {
    const obj = "string";
    const callback = sinon.spy((value, path, parent) => {
      return true;
    });

    searchInObjectFields(obj, callback);

    assert.equal(callback.called, false);
  });

  it("ignores non-object input: boolean", function () {
    const obj = true;
    const callback = sinon.spy((value, path, parent) => {
      return true;
    });

    searchInObjectFields(obj, callback);

    assert.equal(callback.called, false);
  });

  it("ignores non-object input: null", function () {
    const obj = null;
    const callback = sinon.spy((value, path, parent) => {
      return true;
    });

    searchInObjectFields(obj, callback);

    assert.equal(callback.called, false);
  });
});
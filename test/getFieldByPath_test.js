const assert = require("assert");
const { getFieldByPath } = require("../dist/index");

describe("getFieldByPath", function () {
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

  it('top-level value for path ["a"]', function () {
    const path = ["a"];
    const expected = "a";

    assert.deepEqual(getFieldByPath(obj, path), expected);
  });

  it('nested object for path ["b"]', function () {
    const path = ["b"];
    const expected = {
      a: "ba",
    };

    assert.deepEqual(getFieldByPath(obj, path), expected);
  });

  it('nested value for path ["b", "a"]', function () {
    const path = ["b", "a"];
    const expected = "ba";

    assert.deepEqual(getFieldByPath(obj, path), expected);
  });

  it('nested object for path ["c"]', function () {
    const path = ["c"];
    const expected = {
      a: "ca",
      b: {
        a: "cba",
        b: "cbb",
      },
      c: "cc",
    };

    assert.deepEqual(getFieldByPath(obj, path), expected);
  });

  it('nested value for path ["c", "a"]', function () {
    const path = ["c", "a"];
    const expected = "ca";

    assert.deepEqual(getFieldByPath(obj, path), expected);
  });

  it('nested object for path ["c", "b"]', function () {
    const path = ["c", "b"];
    const expected = {
      a: "cba",
      b: "cbb",
    };

    assert.deepEqual(getFieldByPath(obj, path), expected);
  });

  it('nested value for path ["c", "b", "a"]', function () {
    const path = ["c", "b", "a"];
    const expected = "cba";

    assert.deepEqual(getFieldByPath(obj, path), expected);
  });

  it('nested value for path ["c", "b", "b"]', function () {
    const path = ["c", "b", "b"];
    const expected = "cbb";

    assert.deepEqual(getFieldByPath(obj, path), expected);
  });

  it('nested value for path ["c", "c"]', function () {
    const path = ["c", "c"];
    const expected = "cc";

    assert.deepEqual(getFieldByPath(obj, path), expected);
  });

  it('top-level value for path ["d"]', function () {
    const path = ["d"];
    const expected = "d";

    assert.deepEqual(getFieldByPath(obj, path), expected);
  });
});

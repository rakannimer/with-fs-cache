const assert = require("assert");
const { withFsCache, clearFsCacheAt } = require("../dist/index.cjs");

const testWithVoidReturningMethod = async () => {
  let functionCallCount = 0;
  await clearFsCacheAt("a");
  await withFsCache("a", async () => {
    functionCallCount += 1;
  });
  await withFsCache("a", async () => {
    functionCallCount += 1;
  });
  await clearFsCacheAt("a");
  assert(functionCallCount === 1);
};

const testWithNumberReturningMethod = async () => {
  let functionCallCount = 0;
  await clearFsCacheAt("a");
  const resultFromFirstCall = await withFsCache("a", async () => {
    functionCallCount += 1;
    return 1;
  });
  const resultFromSecondCall = await withFsCache("a", async () => {
    functionCallCount += 1;
    return 1;
  });
  await clearFsCacheAt("a");
  assert(functionCallCount === 1);
  assert(resultFromSecondCall === resultFromFirstCall);
};

const testWithStringReturningMethod = async () => {
  let functionCallCount = 0;
  await clearFsCacheAt("a");
  const resultFromFirstCall = await withFsCache("a", async () => {
    functionCallCount += 1;
    return "1";
  });
  const resultFromSecondCall = await withFsCache("a", async () => {
    functionCallCount += 1;
    return "1";
  });
  await clearFsCacheAt("a");
  assert(functionCallCount === 1);
  assert(resultFromSecondCall === resultFromFirstCall);
};

const testWithObjectReturningMethod = async () => {
  let functionCallCount = 0;
  await clearFsCacheAt("a");
  const resultFromFirstCall = await withFsCache("a", async () => {
    functionCallCount += 1;
    return { someData: "1" };
  });
  const resultFromSecondCall = await withFsCache("a", async () => {
    functionCallCount += 1;
    return { someData: "1" };
  });
  await clearFsCacheAt("a");
  const s = JSON.stringify;
  assert(functionCallCount === 1);
  assert(s(resultFromSecondCall) === s(resultFromFirstCall));
};

const testWithArrayReturningMethod = async () => {
  let functionCallCount = 0;
  await clearFsCacheAt("a");
  const resultFromFirstCall = await withFsCache("a", async () => {
    functionCallCount += 1;
    return [{ someData: "1" }, "b", 2];
  });
  const resultFromSecondCall = await withFsCache("a", async () => {
    functionCallCount += 1;
    return [{ someData: "1" }, "b", 2];
  });
  await clearFsCacheAt("a");
  const s = JSON.stringify;
  assert(functionCallCount === 1);
  assert(s(resultFromSecondCall) === s(resultFromFirstCall));
};

const testSyncMethod = () => {
  let functionCallCount = 0;
  clearFsCacheAt("a");
  const resultFromFirstCall = withFsCache("a", () => {
    functionCallCount += 1;
    return [{ someData: "1" }, "b", 2];
  });
  const resultFromSecondCall = withFsCache("a", () => {
    functionCallCount += 1;
    return [{ someData: "1" }, "b", 2];
  });
  clearFsCacheAt("a");
  const s = JSON.stringify;
  assert(functionCallCount === 1);
  assert(s(resultFromSecondCall) === s(resultFromFirstCall));
};

const main = async () => {
  testSyncMethod();
  console.log(`✅ Sync: Ok.`);

  await testWithVoidReturningMethod();
  console.log(`✅ Void: Ok.`);
  await testWithNumberReturningMethod();
  console.log(`✅ Number: Ok.`);
  await testWithStringReturningMethod();
  console.log(`✅ String: Ok.`);
  await testWithObjectReturningMethod();
  console.log(`✅ Object: Ok.`);
  await testWithArrayReturningMethod();
  console.log(`✅ Array: Ok.`);
};

(async () => {
  await main();
})();

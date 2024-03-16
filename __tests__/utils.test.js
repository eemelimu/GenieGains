import {
  lightOrDark,
  epochToDate,
  storeData,
  getData,
  deleteData,
} from "../utils/utils";

test("lightOrDark function returns correct value", () => {
  expect(lightOrDark("rgb(0,0,0)")).toBe("dark");
  expect(lightOrDark("rgb(255,255,255)")).toBe("light");
  expect(lightOrDark("#000000")).toBe("dark");
  expect(lightOrDark("#ffffff")).toBe("light");
  expect(lightOrDark("#ff0000")).toBe("light");
  expect(lightOrDark("#00ff00")).toBe("light");
  expect(lightOrDark("#0000ff")).toBe("dark");
  expect(lightOrDark("#ffff00")).toBe("light");
});

test("epochToDate function returns correct value", () => {
  expect(epochToDate(1709563007768)).toBe("3.4.2024");
  expect(epochToDate(0)).toBe("1.1.1970");
});

test("storeData function stores data correctly", async () => {
  await storeData("test", "test");
});

test("getData function retrieves data correctly", async () => {
  expect(await getData("test")).toBe("test");
});

test("deleteData function deletes data correctly", async () => {
  await deleteData("test");
  expect(await getData("test")).toBe(null);
});

import { deepEqual } from "node:assert";
import { parseEvent } from "./parseEvent.js";

describe("parseEvent", () => {
  it("should return tolerate date only", () => {
    const str = "Dec 20 2021";
    deepEqual(parseEvent(str), ["Dec 20 2021", ""]);
  });
  it("should return location and full date", () => {
    const str = "Dec 20 2021 - Melbourne, Australia";
    deepEqual(parseEvent(str), ["Dec 20 2021", "Melbourne, Australia"]);
  });
  it("should filter out location if hidden", () => {
    const str = "Dec 20 2021 - Place";
    deepEqual(parseEvent(str), ["Dec 20 2021", ""]);
  });
  it("should filter out day if hidden", () => {
    const str = "Dec Day 2021 - Melbourne, Australia";
    deepEqual(parseEvent(str), ["Dec 2021", "Melbourne, Australia"]);
  });
  it("should filter out month if hidden", () => {
    const str = "Day Month 2021 - Melbourne, Australia";
    deepEqual(parseEvent(str), ["2021", "Melbourne, Australia"]);
  });
  it("should filter out place if hidden", () => {
    const str = "Place";
    deepEqual(parseEvent(str), ["", ""]);
  });
  it("should not fail on empty", () => {
    const str = "";
    deepEqual(parseEvent(str), ["", ""]);
  });
});

import { deepEqual } from "assert";
import { parseName } from "./parseName.js";

describe("parseEvent", () => {
    it("should parse full name", () => {
        deepEqual(parseName("John Smith"), { firstName: "John", lastName: "Smith", birthName: undefined });
    });
    it ("should parse birth name with 'born' specifier", () => {
        deepEqual(parseName("Jane Smith (born Doe)"), { firstName: "Jane", lastName: "Smith", birthName: "Doe" });
    });
    it ("should parse birth name with 'nee' specifier", () => {
        deepEqual(parseName("Jane Smith (nee Doe)"), { firstName: "Jane", lastName: "Smith", birthName: "Doe" });
    });
    it ("should parse birth name", () => {
        deepEqual(parseName("Jane Smith (Doe)"), { firstName: "Jane", lastName: "Smith", birthName: "Doe" });
    });
    it ("should parse only last name", () => {
        deepEqual(parseName("Smith"), { firstName: undefined, lastName: "Smith", birthName: undefined });
    });
    it ("should parse only last name with birth name", () => {
        deepEqual(parseName("Smith (Doe)"), { firstName: undefined, lastName: "Smith", birthName: "Doe" });
    });
});

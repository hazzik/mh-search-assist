import { equal } from "assert";
import { slug } from "./slug.js";

describe("slug", () => {
    it("should lowercase and join words with a dash", () => {
        equal(slug("Given Family"), "given-family");
    });
    it("should keep non-latin letters", () => {
        equal(slug("Имя Фамилия"), "имя-фамилия");
    });
    it("should keep accented letters", () => {
        equal(slug("Éxample Ñame"), "éxample-ñame");
    });
    it("should collapse punctuation", () => {
        equal(slug("Family, Given Jr."), "family-given-jr-");
    });
    it("should trim the web site suffix", () => {
        equal(slug("Example Web Site"), "example");
    });
});

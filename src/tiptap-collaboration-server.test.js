import "regenerator-runtime/runtime"; // needed for ``await`` support
import Pattern from "./tiptap-collaboration-server";
import utils from "@patternslib/patternslib/src/core/utils";

describe("pat-tiptap-collaboration-server", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    it("is initialized correctly", async () => {
        document.body.innerHTML = `<div class="pat-tiptap-collaboration-server" />`;
        const el = document.querySelector(".pat-tiptap-collaboration-server");

        // Just an example!
        // eslint-disable-next-line no-unused-vars
        const instance = new Pattern(el);
        await utils.timeout(1); // wait a tick for async to settle.

        expect(document.body.innerHTML).toBe("<p>hello.</p>");
    });
});

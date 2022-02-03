import "regenerator-runtime/runtime"; // needed for ``await`` support
import Base from "@patternslib/patternslib/src/core/base";
import Parser from "@patternslib/patternslib/src/core/parser";

export const parser = new Parser("tiptap-collaboration-server");
parser.addArgument("example-option", [1, 2, 3]);

export default Base.extend({
    name: "tiptap-collaboration-server",
    trigger: ".pat-tiptap-collaboration-server",

    async init() {
        this.options = parser.parse(this.el, this.options);

        // Just an example!
        // eslint-disable-next-line no-unused-vars
        const $ = (await import("jquery")).default; // try to avoid jQuery.

        // Just an example!
        // eslint-disable-next-line no-unused-vars
        const example_option = this.options.exampleOption;

        // Just an example!
        // And completly useless.
        document.body.innerHTML = "<p>hello.</p>";
    },
});

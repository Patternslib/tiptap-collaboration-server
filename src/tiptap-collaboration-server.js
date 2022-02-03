import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { Server } from "@hocuspocus/server";
import { TiptapTransformer } from "@hocuspocus/transformer";
import { readFileSync } from "fs";
import fetch from "node-fetch";
import { generateJSON } from "@tiptap/html";

const url = "http://info.cern.ch/hypertext/WWW/TheProject.html";

const server = Server.configure({
    port: 1234,

    async __onChange(data) {
        const prosemirrorJSON = TiptapTransformer.fromYdoc(data.document);
        console.log(JSON.stringify(prosemirrorJSON));
        console.log(
            `Document ${data.documentName} changed by ${data.context.user.name}`
        );
    },

    async onLoadDocument(data) {
        // The tiptap collaboration extension uses shared types of a single y-doc
        // to store different fields in the same document.
        // The default field in tiptap is simply called 'default'
        const fieldName = "default";

        // Check if the given field already exists in the given y-doc.
        // Important: Only import a document if it doesn't exist in the primary data storage!
        if (!data.document.isEmpty(fieldName)) {
            return;
        }

        // Get the document from somwhere. In a real world application this would
        // probably be a database query or an API call

        let response;
        try {
            response = await fetch(url, {
                method: "GET",
                //mode: "cors",
                //headers: {
                //    "Accept": "application/json",
                //    "Content-Type": "application/json",
                //},
            });
        } catch (e) {
            console.log(e);
            return;
        }
        const result = await response.text();
        console.log(result);

        const prosemirrorJSON = generateJSON(result, [
            Document.default,
            Paragraph.default,
            Text.default,
        ]);
        console.log(prosemirrorJSON);

        //const prosemirrorJSON = JSON.parse(
        //    readFileSync(`/path/to/your/documents/${data.documentName}.json`) || "{}"
        //);

        //const prosemirrorJSON = JSON.parse(`
        //{"default":{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"asdasdasd"}]},{"type":"paragraph","content":[{"type":"text","text":"asdasdl"}]},{"type":"paragraph"},{"type":"paragraph"},{"type":"paragraph","content":[{"type":"text","text":"asdasd"}]},{"type":"paragraph"},{"type":"paragraph"},{"type":"paragraph","content":[{"type":"text","text":"asddddsad"}]},{"type":"paragraph"},{"type":"paragraph"}]}}
        //      `);

        // Convert the editor format to a y-doc. The TiptapTransformer requires you to pass the list
        // of extensions you use in the frontend to create a valid document
        return TiptapTransformer.toYdoc(prosemirrorJSON, fieldName, [
            Document.default,
            Paragraph.default,
            Text.default,
        ]);
    },

    async onAuthenticate({ token }) {
        console.log(token);
        // Example test if a user is authenticated
        if (false && token !== "super-secret-token") {
            throw new Error("Not authorized!");
        }

        // You can set contextual data to use it in other hooks
        return {
            user: {
                id: 1234,
                name: "John",
            },
        };
    },
});

server.listen();

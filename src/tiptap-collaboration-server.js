import fetch from "node-fetch";
import jwt from "jwt-simple";
//import tiptap_config from "@patternslib/pat-tiptap/src/config.js";
import { Server } from "@hocuspocus/server";
import { TiptapTransformer } from "@hocuspocus/transformer";
//import { debounce } from "debounce";

let debounced;

const ARGS = {};
if (process.argv.length < 4) {
    console.warn("Usage: node ./src/tiptap-collaboration-server.js PORT JWT_SECRET");
    process.exit();
}
ARGS.port = process.argv[2];
ARGS.secret = process.argv[3];

const server = Server.configure({
    port: ARGS.port,

    async onChange(data) {
        return; // deactivate
        const save = () => {
            // Convert the y-doc to something you can actually use in your views.
            // In this example we use the TiptapTransformer to get JSON from the given
            // ydoc.
            const prosemirrorJSON = TiptapTransformer.fromYdoc(data.document);

            // Save your document. In a real-world app this could be a database query
            // a webhook or something else
            //writeFile(`/path/to/your/documents/${data.documentName}.json`, prosemirrorJSON);

            // Maybe you want to store the user who changed the document?
            // Guess what, you have access to your custom context from the
            // onConnect hook here. See authorization & authentication for more
            // details
            console.log(
                `Document ${data.documentName} changed by ${data.context.user.name}`,
            );
        };

        debounced?.clear();
        debounced = debounce(save, 4000);
        debounced();
    },

    async onLoadDocument(data) {
        debugger;
        let response;
        try {
            response = await fetch(data.context.user.document_url, {
                method: "GET",
                mode: "cors",
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer " + data.context.user.auth_token,
                },
            });
        } catch (e) {
            throw new Error("Authorization failed.");
        }
        const result = await response.json();

        // fetch the Y.js document from somewhere
        const ydoc = result.data;

        return ydoc;
    },

    async onAuthenticate({ token, documentName }) {
        try {
            const decoded = jwt.decode(token, ARGS.secret);
            console.log(
                `Authentification from ${decoded.user} on document ${documentName}.`,
            );
            // REMOVE
            console.log(`Authentification token ${decoded.auth_token}.`);
            console.log(`Document URL ${decoded.document_url}.`);

            debugger;
            let response;
            try {
                response = await fetch(decoded.document_url, {
                    method: "GET",
                    mode: "cors",
                    headers: {
                        Accept: "application/json",
                        Authorization: "Bearer " + decoded.auth_token,
                    },
                });
            } catch (e) {
                throw new Error("Authorization failed.");
            }
            const result = await response.json();

            return {
                user: {
                    name: decoded.user,
                    auth_token: decoded.auth_token,
                    document_url: decoded.document_url,
                },
            };
        } catch {
            throw new Error("Authorization failed.");
        }
    },
});

server.listen();

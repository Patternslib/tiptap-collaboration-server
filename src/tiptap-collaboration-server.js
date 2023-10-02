import fetch from "node-fetch";
import jwt from "jwt-simple";
//import tiptap_config from "@patternslib/pat-tiptap/src/config.js";
import { Server } from "@hocuspocus/server";
import { TiptapTransformer } from "@hocuspocus/transformer";
import { debounce } from "debounce";

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
        debugger;
        const save = async () => {
            let response;
            try {
                response = await fetch(
                    `${data.context.user.document_url}?metadata_fields=text`,
                    {
                        method: "PATCH",
                        mode: "cors",
                        headers: {
                            Accept: "application/json",
                            Authorization: "Bearer " + data.context.user.auth_token,
                        },
                        body: data.doc,
                    },
                );
            } catch (e) {
                throw new Error("Authorization failed.");
            }
            const result = await response.json();
        };

        debounced?.clear();
        debounced = debounce(save, 4000);
        debounced();
    },

    async onLoadDocument(data) {
        let response;
        try {
            response = await fetch(
                `${data.context.user.document_url}?metadata_fields=text`,
                {
                    method: "GET",
                    mode: "cors",
                    headers: {
                        Accept: "application/json",
                        Authorization: "Bearer " + data.context.user.auth_token,
                    },
                },
            );
        } catch (e) {
            throw new Error("Authorization failed.");
        }
        const result = await response.json();

        // fetch the Y.js document from somewhere
        const ydoc = result.text.data;

        return ydoc;
    },

    async onAuthenticate({ token, documentName }) {
        try {
            const decoded = jwt.decode(token, ARGS.secret);
            console.log(
                `Authentification from ${decoded.user} on document ${documentName}.`,
            );

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

            if (response.status !== "200") {
                throw new Error("Authorization failed.");
            }

            console.log(
                `Authenticated user ${decoded.user} on document ${decoded.document_url}.`,
            );

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

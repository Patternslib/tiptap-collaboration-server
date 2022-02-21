import { Server } from "@hocuspocus/server";
import jwt from "jwt-simple";

const url = "http://info.cern.ch/hypertext/WWW/TheProject.html";

const ARGS = {};
if (process.argv.length < 4) {
    console.warn("Usage: node ./src/tiptap-collaboration-server.js PORT JWT_SECRET");
    process.exit();
}
ARGS.port = process.argv[2];
ARGS.secret = process.argv[3];

const server = Server.configure({
    port: ARGS.port,

    async onAuthenticate({ token, documentName }) {
        try {
            const decoded = jwt.decode(token, ARGS.secret);
            console.log(
                `Authentification from ${decoded.user} on document ${documentName}.`
            );
            return {
                user: {
                    name: decoded.user,
                },
            };
        } catch {
            throw new Error("Authorization failed.");
        }
    },
});

server.listen();

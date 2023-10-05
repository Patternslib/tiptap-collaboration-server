# tiptap-collaboration-server

hocuspocus server for the tiptap collaboration feature for the pat-tiptap
pattern.

## Install and run

```
npx yarn install
node src/tiptap-collaboration-server.js 1234 supersecret
```

## Debugging

Add `debugger;` breakpoints in your code and run:

```
node --inspect src/tiptap-collaboration-server.js 1234 supersecret
```

Then open in Chrome this address: `chrome://inspect` and open the link leading
to the debugger instance.

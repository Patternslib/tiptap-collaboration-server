process.traceDeprecation = true;
const package_json = require("./package.json");
const path = require("path");

module.exports = (env, argv) => {
    const config = {
        entry: {
            bundle: path.resolve(__dirname, "index.js"),
        },
        output: {
            filename: "[name].js",
            chunkFilename: "chunks/[name].[contenthash].min.js",
            path: path.resolve(__dirname, "dist/"),
            clean: true,
            publicPath: "auto",
        },
        optimization: {},
    };

    if (process.env.NODE_ENV === "development") {
        config.optimization.minimize = false;
        config.devtool = false;
        config.watchOptions = {
            ignored: ["node_modules/**", "docs/**"],
        };
    }
    return config;
};

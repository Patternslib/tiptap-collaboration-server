module.exports = {
    npm: {
        publish: true,
    },
    git: {
        requireBranch: ["main"],
        commitMessage: "Release new version.",
        commitArgs: ["-n"],
    },
    plugins: {
        "@release-it/conventional-changelog": {
            infile: "CHANGES.md",
            header: "# Changelog\n\n",
            ignoreRecommendedBump: true,
            preset: {
                name: "conventionalcommits",
                types: [
                    {
                        type: "breaking",
                        section: "Breaking Changes",
                    },
                    {
                        type: "feat",
                        section: "Features",
                    },
                    {
                        type: "fix",
                        section: "Bug Fixes",
                    },
                    {
                        type: "maint",
                        section: "Maintenance",
                    },
                ],
            },
        },
    },
};

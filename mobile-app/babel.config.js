module.exports = function (api) {
    api.cache(true);
    return {
        presets: [
            ["babel-preset-expo", { jsxImportSource: "nativewind" }],
            "nativewind/babel",
        ],
        plugins: [
            [
                "module-resolver",
                {
                    alias: {
                        // "react-native-maps": "./components/ui/MapMock.tsx",
                    },
                },
            ],
            "react-native-reanimated/plugin", // MUST BE LAST
        ],
    };
};

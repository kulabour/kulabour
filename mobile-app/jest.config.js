module.exports = {
    preset: 'jest-expo',
    transformIgnorePatterns: [
        'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)'
    ],
    setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
    collectCoverage: true,
    collectCoverageFrom: [
        'components/**/*.{ts,tsx}',
        '!components/**/__tests__/**/*'
    ]
};

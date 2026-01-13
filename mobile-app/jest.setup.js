<<<<<<< HEAD
/* eslint-disable @typescript-eslint/no-require-imports */
// jest.setup.js
// import 'react-native-gesture-handler/jestSetup';
=======
import '@testing-library/react-native/extend-expect';
>>>>>>> a1da97853617b063e925290de903e16ff3c3c152

// Mock Expo modules
jest.mock('expo-font', () => ({
    loadAsync: jest.fn(),
    isLoaded: jest.fn(() => true),
}));

jest.mock('expo-asset', () => ({
    Asset: {
        loadAsync: jest.fn(),
    },
}));

jest.mock('expo-router', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
    }),
    Link: 'Link',
}));

// Mock vector icons
jest.mock('@expo/vector-icons', () => ({
    Ionicons: 'Ionicons',
    MaterialIcons: 'MaterialIcons',
    FontAwesome: 'FontAwesome',
}));

// Mock Reanimated
require('react-native-reanimated/lib/reanimated2/jestUtils').setUpTests();

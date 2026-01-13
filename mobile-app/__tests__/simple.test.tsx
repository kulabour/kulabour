import React from 'react';
import { render } from '@testing-library/react-native';
import { View, Text } from 'react-native';

// Simple component to test
const SimpleComponent = ({ title }: { title: string }) => (
    <View>
        <Text>{title}</Text>
    </View>
);

describe('SimpleComponent', () => {
    it('renders correctly', () => {
        const { getByText } = render(<SimpleComponent title="Hello World" />);
        expect(getByText('Hello World')).toBeTruthy();
    });
});

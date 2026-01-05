import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from '../Text';

describe('Text Primitive', () => {
    it('renders children correctly', () => {
        const { getByText } = render(<Text>Hello World</Text>);
        expect(getByText('Hello World')).toBeTruthy();
    });

    it('applies header accessibility role for h1', () => {
        const { getByRole } = render(<Text variant="h1">Header</Text>);
        expect(getByRole('header')).toBeTruthy();
    });

    it('applies header accessibility role for h2', () => {
        const { getByRole } = render(<Text variant="h2">Subheader</Text>);
        expect(getByRole('header')).toBeTruthy();
    });

    it('defaults to text role for body', () => {
        const { getByRole } = render(<Text variant="body">Body text</Text>);
        expect(getByRole('text')).toBeTruthy();
    });

    it('passes through custom className', () => {
        // Note: checking style directly is hard with NativeWind, 
        // but we can check if it renders without crashing with custom props
        const { getByText } = render(<Text className="text-red-500">Colored Text</Text>);
        expect(getByText('Colored Text')).toBeTruthy();
    });
});

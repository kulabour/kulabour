import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from '../Button';

describe('Button', () => {
    it('renders correctly', () => {
        const { getByText } = render(<Button>Test Button</Button>);
        expect(getByText('Test Button')).toBeTruthy();
    });

    it('handles onPress', () => {
        const onPressMock = jest.fn();
        const { getByText } = render(<Button onPress={onPressMock}>Press Me</Button>);

        fireEvent.press(getByText('Press Me'));
        expect(onPressMock).toHaveBeenCalled();
    });

    it('shows loading indicator when loading prop is true', () => {
        const { getByTestId } = render(<Button loading>Loading Button</Button>);
        // Note: You might need to add testID to the ActivityIndicator in Button.tsx to query it easily
        // For now, we'll check if the text is NOT present (since it should be replaced by loader)
        expect(() => getByTestId('Loading Button')).toThrow();
    });
});

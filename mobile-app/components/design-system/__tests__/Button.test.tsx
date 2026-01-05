import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../Button';

describe('Button Component', () => {
    it('renders correctly with label', () => {
        const { getByText } = render(<Button label="Test Button" />);
        expect(getByText('Test Button')).toBeTruthy();
    });

    it('handles onPress events', () => {
        const onPressMock = jest.fn();
        const { getByText } = render(<Button label="Press Me" onPress={onPressMock} />);

        fireEvent.press(getByText('Press Me'));
        expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it('shows loading state correctly', () => {
        const { getByRole, queryByText } = render(<Button label="Loading" isLoading />);
        // Should show activity indicator, not text (depending on implementation, but text is usually replaced or overlayed)
        // Our implementation: replaces children with ActivityIndicator
        expect(queryByText('Loading')).toBeNull();
    });

    it('renders with correct accessibility role', () => {
        const { getByRole } = render(<Button label="A11y Button" />);
        expect(getByRole('button')).toBeTruthy();
    });

    it('disables interaction when disabled', () => {
        const onPressMock = jest.fn();
        const { getByText } = render(<Button label="Disabled" isDisabled onPress={onPressMock} />);

        fireEvent.press(getByText('Disabled'));
        expect(onPressMock).not.toHaveBeenCalled();
    });
});

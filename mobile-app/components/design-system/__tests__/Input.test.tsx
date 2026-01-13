import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Input } from '../Input';
import { Text } from '../../primitives/Text';

describe('Input Component', () => {
    it('renders with label correctly', () => {
        const { getByText } = render(<Input label="Email Address" />);
        expect(getByText('Email Address')).toBeTruthy();
    });

    it('handles text input', () => {
        const onChangeTextMock = jest.fn();
        const { getByPlaceholderText } = render(
            <Input placeholder="Enter email" onChangeText={onChangeTextMock} />
        );

        fireEvent.changeText(getByPlaceholderText('Enter email'), 'test@example.com');
        expect(onChangeTextMock).toHaveBeenCalledWith('test@example.com');
    });

    it('displays error text', () => {
        const { getByText } = render(<Input errorText="Invalid email" />);
        expect(getByText('Invalid email')).toBeTruthy();
    });

    it('renders left icon', () => {
        // We can't query by icon content easily without testID, but we can check if it renders without error
        // or checks for text inside the icon if it's a text node
        const { getByText } = render(<Input leftIcon={<Text>Icon</Text>} />);
        expect(getByText('Icon')).toBeTruthy();
    });

    it('has correct accessibility label', () => {
        const { getByLabelText } = render(<Input label="Password" />);
        // Input should use the label as accessibilityLabel
        expect(getByLabelText('Password')).toBeTruthy();
    });
});

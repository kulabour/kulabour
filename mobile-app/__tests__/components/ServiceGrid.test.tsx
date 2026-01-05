import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ServiceGrid } from '../../components/ServiceGrid';

// Mock the router
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}));

describe('ServiceGrid', () => {
    it('renders service categories correctly', () => {
        const { getByText } = render(<ServiceGrid />);

        // Check for some known categories
        expect(getByText('Mason')).toBeTruthy();
        expect(getByText('Plumber')).toBeTruthy();
        expect(getByText('Electrician')).toBeTruthy();
    });

    it('navigates to correct route on press', () => {
        const { getByText } = render(<ServiceGrid />);

        const masonCard = getByText('Mason');
        fireEvent.press(masonCard);

        expect(mockPush).toHaveBeenCalledWith({
            pathname: "/booking/selection",
            params: { service: "Mason" }
        });
    });
});

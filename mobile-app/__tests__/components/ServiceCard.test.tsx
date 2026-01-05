import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ServiceCard } from '../../components/ServiceCard';

// Mock dependencies
jest.mock('expo-router', () => ({
    Link: ({ children, href }: any) => {
        return <>{children}</>;
    }
}));

jest.mock('expo-image', () => ({
    Image: (props: any) => <>{JSON.stringify(props)}</>
}));

jest.mock('expo-linear-gradient', () => ({
    LinearGradient: ({ children }: any) => <>{children}</>
}));

jest.mock('@expo/vector-icons', () => ({
    Ionicons: () => <></>
}));

describe('ServiceCard', () => {
    const defaultProps = {
        title: 'Cleaning',
        hindi: 'सफाई',
        english: 'Deep Cleaning',
        href: '/booking/cleaning',
        price: '499',
        rating: 4.8
    };

    it('renders correctly with given props', () => {
        const { getByText } = render(<ServiceCard {...defaultProps} />);

        expect(getByText('सफाई')).toBeTruthy();
        expect(getByText('Deep Cleaning')).toBeTruthy();
        expect(getByText('₹499')).toBeTruthy();
        expect(getByText('4.8')).toBeTruthy();
    });

    it('shows verified badge when verified prop is true', () => {
        const { getByText } = render(<ServiceCard {...defaultProps} verified={true} />);
        expect(getByText('VERIFIED')).toBeTruthy();
    });

    it('shows online badge when available is true', () => {
        const { getByText } = render(<ServiceCard {...defaultProps} available={true} />);
        expect(getByText('ONLINE')).toBeTruthy();
    });
});

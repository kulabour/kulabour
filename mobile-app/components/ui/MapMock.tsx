import React from 'react';
import { View, Text } from 'react-native';

const MapView = (props: { style?: object;[key: string]: unknown }) => {
    return (
        <View style={[{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0' }, props.style]}>
            <Text>Map is not supported on web</Text>
        </View>
    );
};

function MockMarker({ coordinate, title, description, children }: { coordinate: { latitude: number; longitude: number }; title?: string; description?: string; children?: React.ReactNode }) {
    return (
        <View style={{ left: coordinate.latitude, top: coordinate.longitude }}>
            {children}
            <Text>{title} - {description}</Text>
        </View>
    );
}

function MockCallout({ children }: { children?: React.ReactNode }) {
    return (
        <View>
            {children}
        </View>
    );
}

export const Marker = MockMarker;
export const Callout = MockCallout;
export const Polyline = (_props: object) => null;
export const PROVIDER_GOOGLE = 'google';
export const PROVIDER_DEFAULT = 'default';

export default MapView;

import React from 'react';
import { View, Text } from 'react-native';

const MapView = (props: any) => {
    return (
        <View style={[{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0' }, props.style]}>
            <Text>Map is not supported on web</Text>
        </View>
    );
};

export const Marker = (props: any) => null;
export const Callout = (props: any) => null;
export const Polyline = (props: any) => null;
export const PROVIDER_GOOGLE = 'google';
export const PROVIDER_DEFAULT = 'default';

export default MapView;

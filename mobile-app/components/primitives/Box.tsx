import { View, ViewProps } from 'react-native';


/**
 * Box Primitive
 * 
 * A fundamental layout component that maps to the Design System's standard.
 * Currently a wrapper around styled(View).
 * 
 * Future upgrades:
 * - Enforce padding/margin using spacing tokens prop (e.g., p="md")
 * - Handle safe area insets via prop
 */

interface BoxProps extends ViewProps {
    // Add semantic props here in future (e.g., variant="surface-card")
}

export const Box = ({ className, ...props }: BoxProps) => {
    return <View className={className} {...props} />;
};

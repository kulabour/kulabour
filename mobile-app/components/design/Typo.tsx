import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY } from './DesignSystem';

interface TypoProps extends TextProps {
    children: React.ReactNode;
    color?: string;
    center?: boolean;
}

export const Header = ({ children, style, color = COLORS.text, center, ...props }: TypoProps) => (
    <Text style={[styles.header, { color, textAlign: center ? 'center' : 'auto' }, style]} {...props}>
        {children}
    </Text>
);

export const Title = ({ children, style, color = COLORS.text, center, ...props }: TypoProps) => (
    <Text style={[styles.title, { color, textAlign: center ? 'center' : 'auto' }, style]} {...props}>
        {children}
    </Text>
);

export const Subtitle = ({ children, style, color = COLORS.text, center, ...props }: TypoProps) => (
    <Text style={[styles.subtitle, { color, textAlign: center ? 'center' : 'auto' }, style]} {...props}>
        {children}
    </Text>
);

export const Body = ({ children, style, color = COLORS.textSecondary, center, ...props }: TypoProps) => (
    <Text style={[styles.body, { color, textAlign: center ? 'center' : 'auto' }, style]} {...props}>
        {children}
    </Text>
);

export const Caption = ({ children, style, color = COLORS.textTertiary, center, ...props }: TypoProps) => (
    <Text style={[styles.caption, { color, textAlign: center ? 'center' : 'auto' }, style]} {...props}>
        {children}
    </Text>
);

const styles = StyleSheet.create({
    header: {
        fontSize: TYPOGRAPHY.h1,
        fontWeight: '900', // heavy
        letterSpacing: -0.5,
    },
    title: {
        fontSize: TYPOGRAPHY.h2,
        fontWeight: '700', // bold
    },
    subtitle: {
        fontSize: TYPOGRAPHY.h3,
        fontWeight: '600',
    },
    body: {
        fontSize: TYPOGRAPHY.body,
        fontWeight: '400', // regular
    },
    caption: {
        fontSize: TYPOGRAPHY.caption,
        fontWeight: '500', // medium
    },
});

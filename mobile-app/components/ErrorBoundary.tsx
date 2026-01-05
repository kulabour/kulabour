import React, { Component, ReactNode, ErrorInfo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { logger } from '../services/LoggerService';
import { Button } from './design/Button';
import { Header, Body, Caption } from './design/Typo';
import { COLORS, SPACING, RADIUS } from './design/DesignSystem';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log to our new structured logger
        logger.error('ErrorBoundary', 'Global App Crash Caught', error, {
            componentStack: errorInfo.componentStack
        });

        this.setState({
            error,
            errorInfo
        });
    }

    handleReset = () => {
        logger.info('ErrorBoundary', 'User attempted restart');
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });
    };

    handleGoHome = () => {
        logger.info('ErrorBoundary', 'User navigating home from crash');
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });
        router.replace('/');
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <View style={styles.container}>
                    <View style={styles.content}>
                        <Text style={styles.emoji}>😔</Text>
                        <Header center style={{ marginBottom: SPACING.s }}>कुछ गलत हो गया</Header>
                        <Body center style={{ marginBottom: SPACING.l }}>Something went wrong</Body>

                        {__DEV__ && this.state.error && (
                            <View style={styles.errorBox}>
                                <Text style={styles.errorTitle}>Error Details:</Text>
                                <Text style={styles.errorMessage}>{this.state.error.toString()}</Text>
                            </View>
                        )}

                        <View style={styles.buttonContainer}>
                            <Button
                                title="Try Again / फिर से कोशिश करें"
                                onPress={this.handleReset}
                                variant="primary"
                            />

                            <Button
                                title="Go Home / घर जाएं"
                                onPress={this.handleGoHome}
                                variant="outline"
                            />
                        </View>

                        <Caption center style={{ marginTop: SPACING.l }}>
                            अगर समस्या बनी रहती है, तो कृपया support से संपर्क करें{'\n'}
                            If problem persists, please contact support
                        </Caption>
                    </View>
                </View>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.surface,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.l,
    },
    content: {
        alignItems: 'center',
        maxWidth: 400,
        width: '100%',
    },
    emoji: {
        fontSize: 64,
        marginBottom: SPACING.m,
    },
    errorBox: {
        backgroundColor: '#FFF4F4',
        borderRadius: RADIUS.m,
        padding: SPACING.m,
        marginBottom: SPACING.l,
        width: '100%',
        borderWidth: 1,
        borderColor: '#FFD6D6',
    },
    errorTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.danger,
        marginBottom: SPACING.s,
    },
    errorMessage: {
        fontSize: 12,
        color: COLORS.danger,
        fontFamily: 'monospace',
    },
    buttonContainer: {
        flexDirection: 'column',
        gap: SPACING.m,
        width: '100%',
    },
});

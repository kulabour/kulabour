/**
 * KULABOUR DIMENSION - Neural Glow Network
 * Energy lines connecting UI elements like a neural network
 * Creates a living, breathing interface!
 */

import React, { useRef, useEffect } from 'react';
import { View, Animated, Dimensions, Easing } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

interface NeuralNode {
    x: number;
    y: number;
    id: string;
}

interface NeuralGlowProps {
    nodes?: NeuralNode[];
    color?: string;
    pulseSpeed?: number;
}

export function NeuralGlowNetwork({
    nodes = [],
    color = '#00D4FF',
    pulseSpeed = 2000
}: NeuralGlowProps) {
    const pulseAnim = useRef(new Animated.Value(0)).current;
    const flowAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Continuous pulse
        Animated.loop(
            Animated.timing(pulseAnim, {
                toValue: 1,
                duration: pulseSpeed,
                easing: Easing.inOut(Easing.sin),
                useNativeDriver: true,
            })
        ).start();

        // Flow animation for energy particles
        Animated.loop(
            Animated.timing(flowAnim, {
                toValue: 1,
                duration: 3000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    }, [pulseSpeed]);

    // Generate connection paths between nodes
    const generatePaths = () => {
        if (nodes.length < 2) return [];

        const paths: string[] = [];
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                // Only connect nearby nodes
                const distance = Math.sqrt(
                    Math.pow(nodes[j].x - nodes[i].x, 2) +
                    Math.pow(nodes[j].y - nodes[i].y, 2)
                );

                if (distance < 300) {
                    // Curved bezier path
                    const midX = (nodes[i].x + nodes[j].x) / 2;
                    const midY = (nodes[i].y + nodes[j].y) / 2 - 30;

                    paths.push(
                        `M ${nodes[i].x} ${nodes[i].y} Q ${midX} ${midY} ${nodes[j].x} ${nodes[j].y}`
                    );
                }
            }
        }
        return paths;
    };

    const paths = generatePaths();
    const pulseOpacity = pulseAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0.2, 0.6, 0.2],
    });

    return (
        <View
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                pointerEvents: 'none',
            }}
        >
            <Svg width={width} height={height} style={{ position: 'absolute' }}>
                <Defs>
                    <LinearGradient id="neuralGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <Stop offset="0%" stopColor={color} stopOpacity="0" />
                        <Stop offset="50%" stopColor={color} stopOpacity="0.8" />
                        <Stop offset="100%" stopColor={color} stopOpacity="0" />
                    </LinearGradient>
                </Defs>

                {paths.map((path, index) => (
                    <Path
                        key={index}
                        d={path}
                        stroke="url(#neuralGradient)"
                        strokeWidth={2}
                        fill="none"
                        opacity={0.4}
                    />
                ))}
            </Svg>

            {/* Animated nodes */}
            {nodes.map((node, index) => (
                <Animated.View
                    key={node.id}
                    style={{
                        position: 'absolute',
                        left: node.x - 6,
                        top: node.y - 6,
                        width: 12,
                        height: 12,
                        borderRadius: 6,
                        backgroundColor: color,
                        opacity: pulseOpacity,
                        shadowColor: color,
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 1,
                        shadowRadius: 10,
                    }}
                />
            ))}
        </View>
    );
}

/**
 * Dynamic Neural Background
 * Auto-generates nodes and connections
 */
export function DynamicNeuralBackground({
    nodeCount = 8,
    color = '#00D4FF',
}: {
    nodeCount?: number;
    color?: string;
}) {
    const nodes: NeuralNode[] = React.useMemo(() => {
        return Array.from({ length: nodeCount }, (_, i) => ({
            x: 50 + Math.random() * (width - 100),
            y: 100 + Math.random() * (height - 200),
            id: `node-${i}`,
        }));
    }, [nodeCount]);

    return <NeuralGlowNetwork nodes={nodes} color={color} />;
}

/**
 * Service Card Neural Connector
 * Connects service cards with glowing energy lines
 */
interface ServiceNeuralConnectorProps {
    positions: { x: number; y: number }[];
    activeIndex?: number;
}

export function ServiceNeuralConnector({
    positions,
    activeIndex = -1
}: ServiceNeuralConnectorProps) {
    const glowAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (activeIndex >= 0) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(glowAnim, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(glowAnim, {
                        toValue: 0,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        }
    }, [activeIndex]);

    return (
        <View style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            {positions.map((pos, index) =>
                index > 0 && (
                    <View
                        key={index}
                        style={{
                            position: 'absolute',
                            left: Math.min(positions[index - 1].x, pos.x),
                            top: Math.min(positions[index - 1].y, pos.y),
                            width: Math.abs(pos.x - positions[index - 1].x) || 2,
                            height: Math.abs(pos.y - positions[index - 1].y) || 2,
                            backgroundColor: activeIndex === index ? '#00FF88' : '#00D4FF',
                            opacity: activeIndex === index ? 0.8 : 0.2,
                        }}
                    />
                )
            )}
        </View>
    );
}

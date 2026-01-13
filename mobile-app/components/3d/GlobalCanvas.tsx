import React, { useRef, useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from 'three';

const { width, height } = Dimensions.get('window');

function AnimatedBlob() {
    const mesh = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (!mesh.current) return;
        const time = state.clock.getElapsedTime();
        mesh.current.rotation.x = time * 0.1;
        mesh.current.rotation.y = time * 0.15;
        // Subtle pulse
        const scale = 1 + Math.sin(time * 0.5) * 0.05;
        mesh.current.scale.set(scale, scale, scale);
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <mesh ref={mesh} position={[0, 0, -8]}>
                <torusKnotGeometry args={[3, 1, 128, 32]} />
                <meshStandardMaterial
                    color="#005A9E"
                    emissive="#001F3F"
                    roughness={0.2}
                    metalness={0.9}
                />
            </mesh>
        </Float>
    );
}

function FloatingParticles() {
    const points = useRef<THREE.Points>(null);

    // Generate random particles
    const particles = useMemo(() => {
        const count = 100;
        const positions = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 20; // x
            positions[i * 3 + 1] = (Math.random() - 0.5) * 30; // y
            positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5; // z
        }
        return positions;
    }, []);

    useFrame((state) => {
        if (!points.current) return;
        points.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    });

    return (
        <points ref={points}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particles.length / 3}
                    array={particles}
                    itemSize={3}
                    args={[particles, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.15}
                color="#00B7C3"
                transparent
                opacity={0.6}
            />
        </points>
    );
}

function Scene() {
    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 10]} />

            {/* Lights */}
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1.5} color="#0078D4" />
            <pointLight position={[-10, -10, -10]} intensity={1} color="#FFB900" />

            {/* Content */}
            <Stars radius={50} depth={50} count={1500} factor={4} saturation={0} fade speed={1} />
            <AnimatedBlob />
            <FloatingParticles />

            {/* Fog for depth */}
            <fog attach="fog" args={['#0a0a15', 5, 25]} />
        </>
    );
}

export default function GlobalCanvas() {
    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <Canvas
                dpr={[1, 2]}
                gl={{ antialias: true, alpha: true }}
                style={{ backgroundColor: '#000000', width: '100%', height: '100%' }}
            // OnCreated fallback or error handling could go here
            >
                <Scene />
            </Canvas>

            {/* Gradient Overlay to fade into UI */}
            <View
                style={{
                    ...StyleSheet.absoluteFillObject,
                    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Slightly darker
                }}
            />
        </View>
    );
}

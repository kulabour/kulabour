import React, { useRef } from 'react';
import { View } from 'react-native';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';

function Hammer(props: any) {
    const group = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (!group.current) return;
        const time = state.clock.getElapsedTime();
        group.current.rotation.y = time * 0.5;
        group.current.rotation.z = Math.sin(time * 0.5) * 0.1;
    });

    return (
        <group ref={group} {...props}>
            {/* Handle */}
            <mesh position={[0, -1, 0]}>
                <cylinderGeometry args={[0.15, 0.2, 3, 32]} />
                <meshStandardMaterial color="#8B4513" roughness={0.3} />
            </mesh>
            {/* Head Center */}
            <mesh position={[0, 0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.4, 0.4, 2, 32]} />
                <meshStandardMaterial color="#555" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Head Flat End */}
            <mesh position={[1, 0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.45, 0.45, 0.2, 32]} />
                <meshStandardMaterial color="#Silver" metalness={1} roughness={0.1} />
            </mesh>
            {/* Head Claw End */}
            <mesh position={[-1, 0.7, 0]} rotation={[0, 0, -Math.PI / 4]}>
                <boxGeometry args={[0.8, 0.2, 0.5]} />
                <meshStandardMaterial color="#555" metalness={0.8} roughness={0.2} />
            </mesh>
        </group>
    );
}

function Wrench(props: any) {
    const group = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (!group.current) return;
        const time = state.clock.getElapsedTime();
        group.current.rotation.x = time * 0.3;
        group.current.rotation.y = time * 0.4 + 2;
    });

    return (
        <group ref={group} {...props}>
            <mesh>
                <boxGeometry args={[0.3, 3, 0.1]} />
                <meshStandardMaterial color="#C0C0C0" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh position={[0, 1.6, 0]} rotation={[0, 0, Math.PI / 6]}>
                <torusGeometry args={[0.4, 0.15, 16, 32, Math.PI * 1.5]} />
                <meshStandardMaterial color="#C0C0C0" metalness={0.9} roughness={0.1} />
            </mesh>
        </group>
    );
}

export default function Hero3D() {
    return (
        <View style={{ height: 250, width: '100%' }}>
            <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
                <pointLight position={[-10, -10, -10]} intensity={1} color="#0078D4" />

                <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                    <group position={[0, -0.5, 0]}>
                        <Hammer position={[1.5, 0, 0]} rotation={[0, 0, 0.2]} />
                        <Wrench position={[-1.5, 0.5, 0]} />

                        {/* Central "Orb" representing the core system */}
                        <mesh position={[0, 0, -1]}>
                            <icosahedronGeometry args={[1, 1]} />
                            <meshPhysicalMaterial
                                color="#0078D4"
                                transmission={0.6}
                                thickness={2}
                                roughness={0.2}
                                clearcoat={1}
                            />
                        </mesh>
                    </group>
                </Float>

                <ContactShadows position={[0, -3, 0]} opacity={0.4} scale={20} blur={2} far={4.5} />
                <Environment preset="city" />
            </Canvas>
        </View>
    );
}

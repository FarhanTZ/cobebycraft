import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, RoundedBox, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

interface TiltedScreen3DProps {
  color: string
  secondaryColor: string
}

function SceneObjects({ color, secondaryColor }: { color: string; secondaryColor: string }) {
  const groupRef = useRef<THREE.Group>(null!)
  const meshRef = useRef<THREE.Mesh>(null!)
  const wireframeRef = useRef<THREE.Mesh>(null!)

  useFrame((state, delta) => {
    // Subtle mouse tracking tilt
    const targetX = (state.pointer.x * Math.PI) / 10
    const targetY = -(state.pointer.y * Math.PI) / 12

    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.damp(
        groupRef.current.rotation.y,
        -0.38 + targetX,
        4,
        delta
      )
      groupRef.current.rotation.x = THREE.MathUtils.damp(
        groupRef.current.rotation.x,
        0.06 + targetY,
        4,
        delta
      )
    }

    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.3
      meshRef.current.rotation.y += delta * 0.4
    }

    if (wireframeRef.current) {
      wireframeRef.current.rotation.z -= delta * 0.25
      wireframeRef.current.rotation.y -= delta * 0.2
    }
  })

  return (
    <group ref={groupRef} position={[0.2, 0, 0]} rotation={[0.06, -0.38, -0.015]}>
      {/* 3D Glass Screen Base - Massive Scale */}
      <RoundedBox args={[6.4, 3.9, 0.08]} radius={0.18} smoothness={4} position={[0, 0, -0.1]}>
        <meshPhysicalMaterial
          color="#0b0e1a"
          metalness={0.88}
          roughness={0.16}
          transmission={0.7}
          thickness={0.7}
          transparent
          opacity={0.9}
          reflectivity={0.98}
        />
      </RoundedBox>

      {/* Screen Outline / Border Glow */}
      <RoundedBox args={[6.46, 3.96, 0.02]} radius={0.18} smoothness={4} position={[0, 0, -0.12]}>
        <meshBasicMaterial color={color} wireframe transparent opacity={0.35} />
      </RoundedBox>

      {/* Floating 3D Graphic Elements Inside/Above Screen */}
      <Float speed={2.2} rotationIntensity={0.9} floatIntensity={1.4}>
        {/* Central Organic Distorted Core */}
        <mesh ref={meshRef} position={[0.2, 0.1, 0.4]}>
          <icosahedronGeometry args={[1.2, 4]} />
          <MeshDistortMaterial
            color={color}
            distort={0.44}
            speed={2.6}
            roughness={0.1}
            metalness={0.88}
            emissive={color}
            emissiveIntensity={0.28}
          />
        </mesh>

        {/* Orbiting Tech Wireframe Ring */}
        <mesh ref={wireframeRef} position={[0.2, 0.1, 0.4]}>
          <torusGeometry args={[1.85, 0.05, 16, 64]} />
          <meshStandardMaterial
            color={secondaryColor}
            emissive={secondaryColor}
            emissiveIntensity={0.9}
            wireframe
          />
        </mesh>
      </Float>

      {/* Ambient Sparkles within screen space */}
      <Sparkles
        count={70}
        scale={[6.2, 3.7, 2.6]}
        size={3.5}
        speed={0.5}
        opacity={0.8}
        color={color}
      />
    </group>
  )
}

export default function TiltedScreen3D({ color, secondaryColor }: TiltedScreen3DProps) {
  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 0, 4.8], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[7, 7, 5]} intensity={2.4} color="#ffffff" />
        <pointLight position={[-6, -5, 3]} intensity={3} color={color} />
        <pointLight position={[6, 5, 4]} intensity={2.2} color={secondaryColor} />

        <SceneObjects color={color} secondaryColor={secondaryColor} />
      </Canvas>
    </div>
  )
}

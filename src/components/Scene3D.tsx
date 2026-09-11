import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, OrbitControls, Sphere, Torus, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP)

interface AnimatedShapeProps {
  activeColor: string
}

function AnimatedShape({ activeColor }: AnimatedShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const torusRef = useRef<THREE.Mesh>(null!)
  const [hovered, setHovered] = useState(false)

  // Subtle continuous rotation with useFrame
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2
      meshRef.current.rotation.y += delta * 0.3
    }
    if (torusRef.current) {
      torusRef.current.rotation.z -= delta * 0.4
      torusRef.current.rotation.x += delta * 0.2
    }
  })

  // GSAP animation triggered on hover or color change
  useGSAP(() => {
    if (meshRef.current) {
      gsap.to(meshRef.current.scale, {
        x: hovered ? 1.35 : 1,
        y: hovered ? 1.35 : 1,
        z: hovered ? 1.35 : 1,
        duration: 0.6,
        ease: 'elastic.out(1, 0.4)',
      })

      gsap.to(meshRef.current.rotation, {
        y: `+=${Math.PI * 0.5}`,
        duration: 1,
        ease: 'power2.out',
      })
    }
  }, [hovered, activeColor])

  return (
    <group>
      <Float speed={2.5} rotationIntensity={1.2} floatIntensity={1.8}>
        {/* Core Distorted Sphere */}
        <Sphere
          ref={meshRef}
          args={[1.4, 64, 64]}
          onPointerOver={() => {
            document.body.style.cursor = 'pointer'
            setHovered(true)
          }}
          onPointerOut={() => {
            document.body.style.cursor = 'auto'
            setHovered(false)
          }}
        >
          <MeshDistortMaterial
            color={activeColor}
            distort={0.45}
            speed={2}
            roughness={0.15}
            metalness={0.85}
          />
        </Sphere>

        {/* Orbiting Wireframe Torus */}
        <Torus ref={torusRef} args={[2.3, 0.05, 16, 100]}>
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={0.6}
            wireframe
          />
        </Torus>
      </Float>

      {/* Floating Ambient Sparkles */}
      <Sparkles
        count={70}
        scale={6}
        size={3.5}
        speed={0.4}
        opacity={0.8}
        color="#a855f7"
      />
    </group>
  )
}

interface Scene3DProps {
  color: string
}

export default function Scene3D({ color }: Scene3DProps) {
  return (
    <div className="absolute inset-0 w-full h-full -z-0 pointer-events-auto">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-10, -10, -5]} intensity={1.2} color="#a855f7" />
        <pointLight position={[5, -5, 5]} intensity={1} color="#06b6d4" />

        <AnimatedShape activeColor={color} />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3}
          rotateSpeed={0.6}
        />
      </Canvas>
    </div>
  )
}

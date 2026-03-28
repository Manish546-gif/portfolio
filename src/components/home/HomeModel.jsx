import React, { Suspense, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { Environment, useAnimations, useGLTF } from '@react-three/drei'
import windmillModelUrl from '../../assets/Model/windmill_game_ready.glb?url'
import CloudMarquee from './CloudMarquee'

function Windmill() {
	const { camera, gl } = useThree()
	const groupRef = useRef()
	const targetRotation = useRef({ x: 0, y: 0 })
	const currentRotation = useRef({ x: 0, y: 0 })
	const mouseX = useRef(0)

	useEffect(() => {
		gl.toneMapping = THREE.ACESFilmicToneMapping
		gl.toneMappingExposure = 1.15
		gl.outputColorSpace = THREE.SRGBColorSpace
		gl.shadowMap.enabled = true
		gl.shadowMap.type = THREE.PCFSoftShadowMap
		gl.shadowMap.autoUpdate = true
	}, [gl])

	const model = useGLTF(windmillModelUrl)
	const { actions } = useAnimations(model.animations, model.scene)

	useEffect(() => {
		if (!model.scene) return

		const scene = model.scene
		scene.position.set(0, 0, 0)
		scene.rotation.set(0, 0, 0)
		scene.scale.setScalar(1)

		scene.traverse((obj) => {
			if (obj.isMesh) {
				obj.frustumCulled = false
				obj.castShadow = true
				obj.receiveShadow = true
			}
		})

		const box = new THREE.Box3().setFromObject(scene)
		const size = box.getSize(new THREE.Vector3())
		const center = box.getCenter(new THREE.Vector3())
		const maxDim = Math.max(size.x, size.y, size.z)
		const scale = 6.5 / maxDim

		scene.scale.setScalar(scale)
		scene.position.set(-center.x * scale, -center.y * scale, -center.z * scale)

		const centeredBox = new THREE.Box3().setFromObject(scene)
		const centeredSize = centeredBox.getSize(new THREE.Vector3())

		const vFOV = THREE.MathUtils.degToRad(camera.fov)
		const distanceHeightNeeded = centeredSize.y / (2 * Math.tan(vFOV / 2))
		const distanceWidthNeeded = centeredSize.x / (2 * Math.tan(vFOV / 2) * (window.innerWidth / window.innerHeight))
		const optimalDistance = Math.max(distanceHeightNeeded, distanceWidthNeeded) * 1.1

		camera.position.set(0, 0, optimalDistance)
		camera.lookAt(0, 0, 0)
		camera.near = 0.01
		camera.far = 2000
		camera.updateProjectionMatrix()
	}, [model.scene, camera])

	useEffect(() => {
		const actionKeys = Object.keys(actions || {})
		if (actionKeys.length === 0) return

		const action = actions[actionKeys[0]]
		if (action) {
			action.play()
			action.paused = true
		}
	}, [actions])

	useEffect(() => {
		const handleMouseMove = (e) => {
			const x = (e.clientX / window.innerWidth) * 2 - 1
			const y = -(e.clientY / window.innerHeight) * 2 + 1

			mouseX.current = x
			targetRotation.current.y = x * 0.12
			targetRotation.current.x = y * 0.08
		}

		window.addEventListener('mousemove', handleMouseMove)
		return () => window.removeEventListener('mousemove', handleMouseMove)
	}, [])

	useFrame((state, delta) => {
		if (!groupRef.current) return

		currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * 0.05
		currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * 0.05

		groupRef.current.rotation.order = 'YXZ'
		groupRef.current.rotation.y = -Math.PI / 2.6 + currentRotation.current.y
		groupRef.current.rotation.x = currentRotation.current.x

		const actionKeys = Object.keys(actions || {})
		if (actionKeys.length === 0) return

		const action = actions[actionKeys[0]]
		if (!action) return

		const mx = mouseX.current
		const speed = 13

		if (Math.abs(mx) < 0.05) {
			action.paused = true
		} else {
			action.paused = false
			action.timeScale = -speed * mx

			const clip = action.getClip()
			if (action.time <= 0 && action.timeScale < 0) {
				action.time = clip.duration
			} else if (action.time >= clip.duration && action.timeScale > 0) {
				action.time = 0
			}
		}
	})

	return (
		<group ref={groupRef}>
			<primitive object={model.scene} />
		</group>
	)
}

function Lighting() {
	return (
		<>
			<ambientLight intensity={0.7} />
			<hemisphereLight intensity={1} groundColor='#8b7355' color='#fffef2' />
			<directionalLight
				position={[6, 8, 6]}
				intensity={1.2}
				castShadow
				shadow-mapSize-width={2048}
				shadow-mapSize-height={2048}
				shadow-camera-far={30}
				shadow-camera-left={-15}
				shadow-camera-right={15}
				shadow-camera-top={15}
				shadow-camera-bottom={-15}
			/>
			<directionalLight position={[-4, 4, -4]} intensity={0.6} />
		</>
	)
}

export default function HomeModel() {
	return (
		<div className='relative w-full overflow-hidden h-[140vh]'>
			<div className='absolute inset-0 z-0'>
				<CloudMarquee />
			</div>
			<div className='absolute inset-0 z-20'>
				<Canvas
					dpr={[1, 2]}
					gl={{
						antialias: true,
						alpha: true,
						powerPreference: 'high-performance',
					}}
					camera={{ fov: 45, position: [0, 0, 15] }}
					style={{ width: '100%', height: '70%' }}
				>
					<Suspense fallback={null}>
						<Windmill />
						<Lighting />
						<Environment preset='sunset' blur={0.8} />
					</Suspense>
				</Canvas>
				<div
					className="h-82 w-full bg-linear-to-b from-sky-150 via-sky-150 via-80% to-[#360327]"
				></div>
			</div>
		</div>
	)
}

useGLTF.preload(windmillModelUrl)
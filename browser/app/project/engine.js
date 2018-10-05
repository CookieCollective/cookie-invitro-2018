
import * as THREE from 'three.js';
import { OrbitControls } from '../libs/OrbitControls';
import renderer from '../engine/renderer';
import assets from '../engine/assets';
import Bloom from '../libs/bloom/bloom';
import { uniforms } from './uniform';

export var engine = {
	scene: new THREE.Scene(),
	camera: new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 2000),
	target: new THREE.Vector3(),
	controls: null,
	framerender: null,
	sceneCloud: null,
	frameCloud: new THREE.WebGLRenderTarget(512, 512),
	frametarget: new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight),
	bloom: null,
}

export function initEngine () {

	engine.camera.position.x = 5;
	engine.camera.position.y = 5;
	engine.camera.position.z = 5;

	engine.controls = new OrbitControls(engine.camera, renderer.domElement);
	engine.controls.enableDamping = true;
	engine.controls.dampingFactor = 0.1;
	engine.controls.rotateSpeed = 0.1;
	engine.controls.target.y = 3;

	engine.light = new THREE.DirectionalLight(0xffffff, 1);
	// engine.light.position.set(100, 100, 100);
	engine.light.castShadow = true;
	engine.light.shadow.mapSize.width = 1024;
	engine.light.shadow.mapSize.height = 1024;
	engine.light.shadow.camera.top = 5;
	engine.light.shadow.camera.bottom = -5;
	engine.light.shadow.camera.left = -5;
	engine.light.shadow.camera.right = 5;
	engine.light.shadow.camera.near = -10;
	engine.light.shadow.camera.far = 100;
	engine.light.shadow.bias = 0.01;
	engine.light.target = new THREE.Object3D();
	engine.scene.add(engine.light);
	engine.scene.add(engine.light.target);
	// engine.scene.add(new THREE.CameraHelper( engine.light.shadow.camera ));
	
	assets.shaders.cloudGenerator.uniforms = uniforms;
	engine.sceneCloud = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), assets.shaders.cloudGenerator);
	engine.sceneCloud.frustumCulled = false;

	engine.framerender = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), assets.shaders.render);
	engine.framerender.frustumCulled = false;

	engine.bloom = new Bloom(engine.frametarget.texture);
}
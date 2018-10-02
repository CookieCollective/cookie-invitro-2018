
import * as THREE from 'three.js';
import { OrbitControls } from '../libs/OrbitControls';
import renderer from '../engine/renderer';
import assets from '../engine/assets';
import Bloom from '../libs/bloom/bloom';

export var engine = {
	scene: new THREE.Scene(),
	camera: new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.01, 2000),
	controls: null,
	framerender: null,
	frametarget: new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight),
	bloom: null,
}

export function initEngine () {
	engine.controls = new OrbitControls(engine.camera, renderer.domElement);
	engine.framerender = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), assets.shaders.render);
	engine.framerender.frustumCulled = false;
	engine.bloom = new Bloom(engine.frametarget.texture);
}

import * as THREE from 'three.js';
import { OrbitControls } from '../libs/OrbitControls';
import renderer from '../engine/renderer';
import assets from '../engine/assets';
import Bloom from '../libs/bloom/bloom';
import { uniforms } from './uniform';
import { clamp, lerp, lerpArray, lerpVector, lerpArray2, lerpVectorArray, saturate } from '../engine/misc';

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
	timeLoop: 0,
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
	engine.light.shadow.mapSize.width = 2048;
	engine.light.shadow.mapSize.height = 2048;
	engine.light.shadow.camera.top = 10;
	engine.light.shadow.camera.bottom = -10;
	engine.light.shadow.camera.left = -10;
	engine.light.shadow.camera.right = 10;
	engine.light.shadow.camera.near = -10;
	engine.light.shadow.camera.far = 100;
	// engine.light.shadow.radius = 2.;
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

var vector = new THREE.Vector3();
var array = [0,0,0];
var arrayCamera = [0,0,0];
var arrayFOV = [0,0,0];
var arrayTarget = [0,0,0];
var arraySun = [0,0,0];

export function updateEngine (elapsed) {
	engine.controls.update();
	array = assets.animations.getPosition('camera', elapsed);
	arrayCamera = lerpArray(arrayCamera, array, .1);
	engine.camera.position.set(arrayCamera[0], arrayCamera[1], arrayCamera[2]);

	array = assets.animations.getPosition('fov', elapsed);
	arrayFOV = lerpArray(arrayFOV, array, .1);
	if (arrayFOV[1] != engine.camera.fov) {
		engine.camera.fov = arrayFOV[1];
		engine.camera.updateProjectionMatrix();
	}
	
	array = assets.animations.getPosition('target', elapsed);
	arrayTarget = lerpArray(arrayTarget, array, .1);
	engine.target.set(arrayTarget[0], arrayTarget[1], arrayTarget[2]);
	engine.camera.lookAt(engine.target);

	array = assets.animations.getPosition('sun', elapsed);
	arraySun = lerpArray(arraySun, array, .1);
	engine.light.position.set(arrayCamera[0], arrayCamera[1], arrayCamera[2]);
	engine.light.position.add(engine.camera.getWorldDirection(vector).multiplyScalar(5));
	engine.light.target.position.set(arrayCamera[0]-arraySun[0], arrayCamera[1]-arraySun[1], arrayCamera[2]-arraySun[2]);

	// array = assets.animations.getPosition('moon', elapsed);
	// engine.light.position.set(array[0], array[1], array[2]);
}
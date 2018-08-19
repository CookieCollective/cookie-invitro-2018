
import * as THREE from 'three.js';
import { OrbitControls } from './libs/OrbitControls';
import assets from './engine/assets';
import renderer from './engine/renderer';
import parameters from './engine/parameters';
import { clamp, lerp, lerpArray, lerpVector, lerpVectorArray, saturate } from './engine/misc';
import * as timeline from './engine/timeline';
import * as makeText from './engine/make-text';
import Mouse from './engine/mouse';
import Geometry from './engine/geometry';
import FrameBuffer from './engine/framebuffer';
import { gui } from './engine/gui';

export default function() {
	var scene, camera, controls, uniforms, framerender, frametarget;
	var keys, deltas, params;

	assets.load(function() {
		scene = new THREE.Scene();
		framerender = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), assets.shaders.render);
		frametarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);

		camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.01, 2000);
		camera.position.x = 0;
		camera.position.y = 2.5;
		camera.position.z = 5;

		controls = new OrbitControls(camera, renderer.domElement);
		controls.enableDamping = true;
		controls.dampingFactor = 0.5;
		controls.rotateSpeed = 0.25;

		uniforms = {
			time: { value: 0 },
			resolution: { value: [window.innerWidth, window.innerHeight] },
			cameraPos: { value: camera.position },
			cameraTarget: { value: controls.target },
			frame: { value: frametarget.texture },
		}
		params = Object.keys(parameters.debug);
		keys = Object.keys(assets.animations.actions);
		deltas = {};
		keys.forEach(name => {
			uniforms[name] = {value:[0,0,0]};
			deltas[name] = [0,0,0];
		});
		params.forEach(name =>  uniforms[name] = {value:parameters.debug[name]});

		assets.shaders.render.uniforms = uniforms;
		add(assets.shaders.points, Geometry.create(Geometry.random(1000)));
		var wireframe = new THREE.LineSegments(new THREE.EdgesGeometry(assets.geometries.cookie.children[0].geometry), assets.shaders.wireframe);
		// wireframe.scale.multiplyScalar(100.);
		scene.add(wireframe);
		
		onWindowResize();
		window.addEventListener('resize', onWindowResize, false);
		requestAnimationFrame(animate);
		timeline.start();
	});

	function add(material, geometries, sceneLayer, matrix) {
		material.uniforms = uniforms;
		sceneLayer = sceneLayer || scene;
		geometries = geometries || [ new THREE.PlaneGeometry(1,1) ];
		matrix = matrix || new THREE.Matrix4();
		geometries.forEach(geometry => {
			var mesh = new THREE.Mesh(geometry, material);
			mesh.frustumCulled = false;
			mesh.applyMatrix(matrix);
			sceneLayer.add(mesh);
		});
	}

	function animate(elapsed) {
		requestAnimationFrame(animate);
		elapsed /= 1000.;
		// elapsed = timeline.getTime();
		controls.update();
		
		uniforms.time.value = elapsed;
		uniforms.cameraPos.value = camera.position;
		uniforms.cameraTarget.value = controls.target;
		keys.forEach(name => {
			var pos = assets.animations.getPosition(name, elapsed);
			deltas[name] = lerpArray(deltas[name], pos, .1);
			uniforms[name].value = pos;
		});
		params.forEach(name =>  uniforms[name].value = parameters.debug[name]);
		
		renderer.render(scene, camera, frametarget, true);
		renderer.render(framerender, camera);
	}

	function onWindowResize() {
		var w = window.innerWidth / renderer.scale;
		var h = window.innerHeight / renderer.scale;
		renderer.setSize(window.innerWidth, window.innerHeight);
		uniforms.resolution.value[0] = w;
		uniforms.resolution.value[1] = h;
		frametarget.setSize(w,h);
		camera.aspect = w/h;
		camera.updateProjectionMatrix();
	}
}


import * as THREE from 'three.js';
import { clamp, lerp, lerpArray, lerpVector, lerpVectorArray, saturate } from './engine/misc';
import assets from './engine/assets';
import renderer from './engine/renderer';
import Geometry from './engine/geometry';
import mouse from './engine/mouse';

export default function() {

	var scene, camera, uniforms;

	assets.load(function() {

		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, .01, 1000);

		camera.position.z = 3;
		camera.targetLookAt = new THREE.Vector3();

		uniforms = {
			time: { value: 0 },
			mouse: { value: [0,0] },
			resolution: { value: [window.innerWidth, window.innerHeight] },
		}

		Object.keys(assets.shaders).forEach(key => assets.shaders[key].uniforms = uniforms);

		scene.add(new THREE.Mesh(Geometry.createLine(assets.geometries.cookie)[0], assets.shaders.line));
		scene.add(new THREE.Mesh(Geometry.create(Geometry.random(100))[0], assets.shaders.ray));
		scene.add(new THREE.Mesh(Geometry.create(Geometry.random(200))[0], assets.shaders.star));

		onWindowResize();
		window.addEventListener('resize', onWindowResize, false);
		window.addEventListener('mousemove', mouse.onMove, false);
		requestAnimationFrame(animate);
	});

	function animate(elapsed) {
		requestAnimationFrame(animate);

		uniforms.time.value = elapsed / 1000;
		uniforms.mouse.value[0] = -1. + 2. * mouse.x / window.innerWidth;
		uniforms.mouse.value[1] = -1. + 2. * mouse.y / window.innerHeight;

		camera.position.x = lerp(camera.position.x, -uniforms.mouse.value[0]*.5, .1);
		camera.position.y = lerp(camera.position.y, uniforms.mouse.value[1]*.5, .1);
		camera.lookAt(camera.targetLookAt);
		camera.updateMatrix();

		renderer.render(scene, camera);
	}

	function onWindowResize() {
		var w = window.innerWidth / renderer.scale;
		var h = window.innerHeight / renderer.scale;
		renderer.setSize(window.innerWidth, window.innerHeight);
		camera.aspect = w/h;
		camera.updateProjectionMatrix();
		uniforms.resolution.value[0] = w;
		uniforms.resolution.value[1] = h;
	}
}

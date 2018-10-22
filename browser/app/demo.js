
import * as THREE from 'three.js';
import { clamp, lerp, lerpArray, lerpVector, lerpVectorArray, saturate } from './engine/misc';
import assets from './engine/assets';
import renderer from './engine/renderer';
import Geometry from './engine/geometry';
import mouse from './engine/mouse';

export default function() {

	var scene, camera, frame, uniforms, quad;

	assets.load(function() {

		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, .01, 1000);
		frame = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);

		camera.position.z = 3;

		uniforms = {
			time: { value: 0 },
			mouse: { value: [0,0] },
			resolution: { value: [window.innerWidth, window.innerHeight] },
			frame: { value: frame.texture },
			uTitle: { value: assets.textures.title },
			uDemo: { value: assets.textures.demo },
		}

		Object.keys(assets.shaders).forEach(key => assets.shaders[key].uniforms = uniforms);

		// add(assets.shaders.points, Geometry.create(Geometry.random(20)));
		// add(assets.shaders.basic, [assets.geometries.title])
		scene.add(new THREE.Mesh(Geometry.createLine(assets.geometries.cookie)[0], assets.shaders.line));
		// scene.add(new THREE.Mesh(Geometry.create(assets.geometries.cookie.attributes)[0], assets.shaders.point));
		quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(1,1), assets.shaders.render);
		quad.frustumCulled = false;

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

		renderer.render(scene, camera, frame, true);
		renderer.render(quad, camera);
	}

	function onWindowResize() {
		var w = window.innerWidth / renderer.scale;
		var h = window.innerHeight / renderer.scale;
		renderer.setSize(window.innerWidth, window.innerHeight);
		camera.aspect = w/h;
		camera.updateProjectionMatrix();
		frame.setSize(w, h);
		uniforms.resolution.value[0] = w;
		uniforms.resolution.value[1] = h;
	}
}


import * as THREE from 'three.js';
import assets from './engine/assets';
import renderer from './engine/renderer';
import parameters from './engine/parameters';
import { clamp, lerp, lerpArray, lerpVector, lerpVectorArray, saturate } from './engine/misc';
import { generateCurve, add, addWireframe, addShape2D } from './project/helper';
import { engine, initEngine } from './project/engine';
import { uniforms, initUniforms, updateUniforms, resizeUniforms } from './project/uniform';
import { addText } from './project/text';
import { gui } from './engine/gui';
import * as timeline from './engine/timeline';
import Geometry from './engine/geometry';
import Mouse from './engine/mouse';

export default function() {

	assets.load(function() {
		initEngine();
		initUniforms();

		engine.camera.position.x = 5;
		engine.camera.position.y = 2;
		engine.camera.position.z = 0;

		engine.controls.enableDamping = true;
		engine.controls.dampingFactor = 0.01;
		engine.controls.rotateSpeed = 0.01;
		engine.controls.target.y = 3;
		engine.controls.enablePan = false;
		engine.controls.minDistance = 2.;
		engine.controls.maxDistance = 5.;
		engine.controls.minPolarAngle = -Math.PI/8.+Math.PI/2.;
		engine.controls.maxPolarAngle = Math.PI/8.+Math.PI/2.;

		// add(assets.shaders.raymarching);

		var cookie = assets.geometries.cookie;
		add(assets.shaders.star, Geometry.create(Geometry.random(1000)));
		addWireframe(assets.shaders.wireframe, [cookie]);
		add(assets.shaders.desert, [new THREE.PlaneGeometry(20,20,100,100)]);
		add(assets.shaders.chocolat, Geometry.clone(new THREE.DodecahedronBufferGeometry(1, 0), 50));
		addText();

		onWindowResize();
		window.addEventListener('resize', onWindowResize, false);
		window.addEventListener('mousemove', Mouse.onMove, false);
		requestAnimationFrame(animate);
		timeline.start();
	});

	function animate(elapsed) {
		requestAnimationFrame(animate);
		elapsed /= 1000.;
		// elapsed = timeline.getTime();
		engine.controls.update();

		updateUniforms(elapsed);
		
		renderer.render(engine.scene, engine.camera, engine.frametarget, true);
		engine.bloom.render(renderer);
		renderer.render(engine.framerender, engine.camera);
		// renderer.render(engine.scene, engine.camera);
	}

	function onWindowResize() {
		var w = window.innerWidth / renderer.scale;
		var h = window.innerHeight / renderer.scale;
		renderer.setSize(window.innerWidth, window.innerHeight);
		engine.bloom.resize();
		engine.frametarget.setSize(w,h);
		engine.camera.aspect = w/h;
		engine.camera.updateProjectionMatrix();
		resizeUniforms(w, h);
	}
}

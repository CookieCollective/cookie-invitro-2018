
import * as THREE from 'three.js';
import assets from './engine/assets';
import renderer from './engine/renderer';
import parameters from './engine/parameters';
import * as timeline from './engine/timeline';
import { clamp, lerp, lerpArray, lerpVector, lerpVectorArray, saturate } from './engine/misc';
import { generateCurve, add, addWireframe, addShape2D } from './project/helper';
import { engine, initEngine } from './project/engine';
import { uniforms, initUniforms, updateUniforms, resizeUniforms } from './project/uniform';
import { addText } from './project/text';
import { gui } from './engine/gui';
import Geometry from './engine/geometry';
import Mouse from './engine/mouse';

export default function() {

	assets.load(function() {
		initEngine();
		initUniforms();

		// add(assets.shaders.raymarching);
		
		var meshes;
		var cookie = assets.geometries.cookie;
		var satelitte = assets.geometries.satelitte;
		// add(assets.shaders.star, Geometry.create(Geometry.random(1000)));
		add(assets.shaders.lensflare, Geometry.create(Geometry.random(20)));
		meshes = add(assets.shaders.satelitte, [satelitte.children[0].geometry]);
		meshes.forEach(mesh => mesh.castShadow = true );
		// addWireframe(assets.shaders.wireframe, [cookie]);

		meshes = add(assets.shaders.desert, [new THREE.PlaneGeometry(100,100,100,100)]);
		meshes.forEach(mesh => mesh.receiveShadow = true );
		add(assets.shaders.sky, [new THREE.DodecahedronBufferGeometry(1000, 0)]);
		// add(assets.shaders.chocolat, Geometry.clone(new THREE.DodecahedronBufferGeometry(1, 0), 50));
		// addText();

		onWindowResize();
		window.addEventListener('resize', onWindowResize, false);
		window.addEventListener('mousemove', Mouse.onMove, false);
		requestAnimationFrame(animate);
		timeline.start();
	});

	function animate(elapsed) {
		requestAnimationFrame(animate);
		// elapsed /= 1000.;
		elapsed = timeline.getTime();

		engine.controls.update();
		var array;
		array = assets.animations.getPosition('camera', elapsed);
		engine.camera.position.set(array[0], array[1], array[2]);
		
		array = assets.animations.getPosition('target', elapsed);
		engine.target.set(array[0], array[1], array[2]);
		engine.camera.lookAt(engine.target);

		array = assets.animations.getPosition('sun', elapsed);
		engine.light.position.set(array[0], array[1], array[2]);

		// array = assets.animations.getPosition('moon', elapsed);
		// engine.light.position.set(array[0], array[1], array[2]);

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

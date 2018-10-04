
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

		engine.camera.position.x = 25;
		engine.camera.position.y = 25;
		engine.camera.position.z = 25;

		engine.controls.enableDamping = true;
		engine.controls.dampingFactor = 0.1;
		engine.controls.rotateSpeed = 0.1;
		engine.controls.target.y = 3;

		// add(assets.shaders.raymarching);
		
		var cookie = assets.geometries.cookie;
		var satelitte = assets.geometries.satelitte;
		add(assets.shaders.star, Geometry.create(Geometry.random(1000)));
		add(assets.shaders.satelitte, [satelitte.children[0].geometry]);
		assets.shaders.satelitte.castShadow = true;
		assets.shaders.satelitte.receiveShadow = true;
		// addWireframe(assets.shaders.wireframe, [cookie]);

		// var mat = new THREE.MeshStandardMaterial( { color: 0x00ff00 } );
		// add(new THREE.MeshStandardMaterial( { color: 0xff0000 } ), [new THREE.PlaneGeometry(100,100,1,1)]);
		// add(mat, [new THREE.DodecahedronBufferGeometry(5, 2)]);
		add(assets.shaders.desert, [new THREE.PlaneGeometry(100,100,100,100)]);

		// for meshes
		assets.shaders.desert.castShadow = true;
		assets.shaders.desert.receiveShadow = true;
		// add(assets.shaders.floor, [new THREE.PlaneGeometry(1000,1000,1,1)]);
		add(assets.shaders.sun, [new THREE.DodecahedronBufferGeometry(1, 2)]);
		add(assets.shaders.sky, [new THREE.DodecahedronBufferGeometry(1000, 0)]);
		// add(assets.shaders.chocolat, Geometry.clone(new THREE.DodecahedronBufferGeometry(1, 0), 50));
		// addText();

		engine.light = new THREE.DirectionalLight(0xffffff, 1);
		engine.light.position.set(100, 100, 100);
		engine.light.castShadow = true;
		engine.light.shadow.mapSize.width = 1024;
		engine.light.shadow.mapSize.height = 1024;
		engine.light.shadow.camera.top = 100;
		engine.light.shadow.camera.bottom = -100;
		engine.light.shadow.camera.left = -100;
		engine.light.shadow.camera.right = 100;
		engine.light.shadow.camera.near = 0.1;
		engine.light.shadow.camera.far = 1000;
		engine.light.shadow.camera.bias = 0.01;
		engine.scene.add(engine.light);

		engine.scene.add( new THREE.CameraHelper( engine.light.shadow.camera ) );

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
		// engine.camera.position.set(array[0], array[1], array[2]);
		
		array = assets.animations.getPosition('target', elapsed);
		// engine.target.set(array[0], array[1], array[2]);
		// engine.camera.lookAt(engine.target);

		array = assets.animations.getPosition('sun', elapsed);
		engine.light.position.set(array[0], array[1], array[2]);

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

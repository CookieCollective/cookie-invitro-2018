
import * as THREE from 'three.js';
import { OrbitControls } from './libs/OrbitControls';
import assets from './engine/assets';
import renderer from './engine/renderer';
import parameters from './engine/parameters';
import { clamp, lerp, lerpArray, lerpVector, lerpVectorArray, saturate } from './engine/misc';
import Bloom from './libs/bloom/bloom';
import * as timeline from './engine/timeline';
import * as makeText from './engine/make-text';
import Mouse from './engine/mouse';
import Geometry from './engine/geometry';
import FrameBuffer from './engine/framebuffer';
import { gui } from './engine/gui';

export default function() {
	var scene, sceneUI, camera, controls, uniforms, framerender, frametarget, frameUI, bloom;
	var keys, deltas, params, uniformsToUpdate;

	assets.load(function() {
		scene = new THREE.Scene();
		sceneUI = new THREE.Scene();
		framerender = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), assets.shaders.render);
		frametarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
		frameUI = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
		bloom = new Bloom(frametarget.texture);

		camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.01, 2000);
		camera.position.x = 0;
		camera.position.y = 3;
		camera.position.z = 2;

		controls = new OrbitControls(camera, renderer.domElement);
		controls.enableDamping = true;
		controls.dampingFactor = 0.5;
		controls.rotateSpeed = 0.25;

		var curveArray = assets.geometries.curve.children[0].geometry.attributes.position.array;
		var dataArray = [];
		for (var i = 0; i < curveArray.length / 3 / 2; ++i) {
			for (var x = 0; x < 3; ++x) {
				dataArray.push(curveArray[i*2*3+x]);
			}
		}
		var dataNormalArray = [];
		var posVector = new THREE.Vector3();
		var nextVector = new THREE.Vector3();
		var biVector = new THREE.Vector3();
		var tangentVectors = [];
		var normalVectors = [(new THREE.Vector3(-.5,0,1)).normalize()];
		for (var i = 0; i < dataArray.length/3; ++i) {
			tangentVectors.push(new THREE.Vector3());
			posVector.set(dataArray[i*3], dataArray[i*3+1], dataArray[i*3+2]);
			if ((i+1) * 3 + 2 < dataArray.length) {
				nextVector.set(dataArray[(i+1)*3], dataArray[(i+1)*3+1], dataArray[(i+1)*3+2]);
				tangentVectors[i].subVectors(nextVector, posVector).normalize();
			} else {
				nextVector.set(dataArray[(i-1)*3], dataArray[(i-1)*3+1], dataArray[(i-1)*3+2]);
				tangentVectors[i].subVectors(posVector, nextVector).normalize();
			}
		}
		dataNormalArray.push(normalVectors[0].x, normalVectors[0].y, normalVectors[0].z);
		for (var i = 0; i < tangentVectors.length - 1; ++i) {
			biVector.crossVectors(tangentVectors[i], tangentVectors[i+1]);
			normalVectors.push(new THREE.Vector3());
			var normal = normalVectors[i];
			if (biVector.length() == 0.) {
				normalVectors[i+1].set(normal.x, normal.y, normal.z);
			} else {
				biVector.normalize();
				var angle = Math.acos(tangentVectors[i].dot(tangentVectors[i+1]));
				posVector.set(normal.x, normal.y, normal.z);
				normalVectors[i+1] = posVector.applyAxisAngle(biVector, angle);
			}
			dataNormalArray.push(normalVectors[i+1].x, normalVectors[i+1].y, normalVectors[i+1].z);
		}


		uniforms = {
			time: { value: 0 },
			resolution: { value: [window.innerWidth, window.innerHeight] },
			cameraPos: { value: camera.position },
			cameraTarget: { value: controls.target },
			frame: { value: frametarget.texture },
			frameUI: { value: frameUI.texture },
			blur: { value: bloom.blurTarget.texture },
			bloom: { value: bloom.bloomTarget.texture },
			curve: { value: FrameBuffer.createDataTexture(dataArray, 3)},
			curveNormal: { value: FrameBuffer.createDataTexture(dataNormalArray, 3)},
		}
		params = Object.keys(parameters.debug);
		keys = Object.keys(assets.animations.actions);
		deltas = {};
		keys.forEach(name => {
			uniforms[name] = {value:[0,0,0]};
			deltas[name] = [0,0,0];
		});
		params.forEach(name =>  uniforms[name] = {value:parameters.debug[name]})

		assets.shaders.render.uniforms = uniforms;
		// var cookie = assets.geometries.cookie;
		// var cookieAttributes = Geometry.create(cookie.attributes);
		add(assets.shaders.points, Geometry.create(Geometry.random(1000)));
		add(assets.shaders.lensflare, Geometry.create(Geometry.random(100)));
		addWireframe(assets.shaders.constellation, [new THREE.OctahedronGeometry(1000., 4.)]);
		add(assets.shaders.lines, Geometry.create(Geometry.random(20), [1,50]));
		add(assets.shaders.curve, Geometry.create(Geometry.random(1), [dataArray.length/3, 1]));
		// addWireframe(assets.shaders.wireframe, [cookie]);

		uniformsToUpdate = [];
		addShape2D(assets.shaders.shape2D.clone(),
		[-.9,.9,.5,.125/2.], // rect.xyzw
		[-1,1], // anchor
		[-25,0], // offset
		makeText.createTexture([{
			text: 'cookie demoparty',
			font: 'bebasneue_bold',
			width: 512,
			height: 64,
			fontSize: 80,
			textAlign: 'center',
			textBaseline: 'middle',
		}]));

		addShape2D(assets.shaders.shape2D.clone(),
		[.9,-.9,.5,.125/2.], // rect.xyzw
		[1,-1], // anchor
		[55,0], // offset
		makeText.createTexture([{
			text: 'november 2018',
			font: 'bebasneue_bold',
			width: 512,
			height: 64,
			fontSize: 80,
			textAlign: 'center',
			textBaseline: 'middle',
		}]));
		
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

	function addWireframe(material, geometries, sceneLayer, matrix) {
		material.uniforms = uniforms;
		sceneLayer = sceneLayer || scene;
		geometries = geometries || [ new THREE.PlaneGeometry(1,1) ];
		matrix = matrix || new THREE.Matrix4();
		geometries.forEach(geometry => {
			var mesh = new THREE.LineSegments(new THREE.EdgesGeometry(geometry), material);
			mesh.frustumCulled = false;
			mesh.applyMatrix(matrix);
			sceneLayer.add(mesh);
		});
	}

	function addShape2D(material, rect, anchor, offset, texture, sceneLayer) {
		rect = rect || [0,0,1,1];
		anchor = anchor || [0,0];
		offset = offset || [0,0];
		sceneLayer = sceneLayer || scene;
		var mesh = new THREE.Mesh(new THREE.PlaneGeometry(1,1), material);
		mesh.frustumCulled = false;
		sceneLayer.add(mesh);
		material.uniforms.resolution = { value: [window.innerWidth, window.innerHeight] };
		material.uniforms.rect = { value: rect };
		material.uniforms.anchor = { value: anchor };
		material.uniforms.offset = { value: offset };
		material.uniforms.texture = { value: texture };
		uniformsToUpdate.push(material.uniforms);
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
		renderer.render(sceneUI, camera, frameUI, true);
		bloom.render(renderer);
		renderer.render(framerender, camera);
	}

	function onWindowResize() {
		var w = window.innerWidth / renderer.scale;
		var h = window.innerHeight / renderer.scale;
		renderer.setSize(window.innerWidth, window.innerHeight);
		uniforms.resolution.value[0] = w;
		uniforms.resolution.value[1] = h;
		bloom.resize();
		frametarget.setSize(w,h);
		camera.aspect = w/h;
		camera.updateProjectionMatrix();
		uniformsToUpdate.forEach(item => item.resolution.value = [window.innerWidth, window.innerHeight]);
	}
}

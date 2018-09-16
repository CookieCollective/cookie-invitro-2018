
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
import { generateCurve } from './project/curve';
import { gui } from './engine/gui';

export default function() {
	var scene, camera, controls, uniforms, framerender, frametarget, bloom;
	var keys, deltas, params, uniformsToUpdate;

	assets.load(function() {
		scene = new THREE.Scene();
		framerender = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), assets.shaders.render);
		framerender.frustumCulled = false;
		frametarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
		bloom = new Bloom(frametarget.texture);

		camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.01, 2000);
		camera.position.x = 5;
		camera.position.y = 2;
		camera.position.z = 0;

		controls = new OrbitControls(camera, renderer.domElement);
		controls.enableDamping = true;
		// controls.dampingFactor = 0.01;
		// controls.rotateSpeed = 0.01;
		controls.dampingFactor = 0.1;
		controls.rotateSpeed = 0.1;
		// controls.target.y = 3;
		// controls.enablePan = false;
		// controls.minDistance = 2.;
		// controls.maxDistance = 5.;
		// controls.minPolarAngle = -Math.PI/8.+Math.PI/2.;
		// controls.maxPolarAngle = Math.PI/8.+Math.PI/2.;

		// var curveArray = assets.geometries.curve.children[0].geometry.attributes.position.array;
		// generateCurve(curveArray, assets.shaders.curve, scene);

		uniforms = {
			time: { value: 0 },
			resolution: { value: [window.innerWidth, window.innerHeight] },
			mouse: { value: [window.innerWidth/2, window.innerHeight/2] },
			cameraPos: { value: camera.position },
			cameraTarget: { value: controls.target },
			frame: { value: frametarget.texture },
			blur: { value: bloom.blurTarget.texture },
			bloom: { value: bloom.bloomTarget.texture },
		}
		params = Object.keys(parameters.debug);
		keys = Object.keys(assets.animations.actions);
		deltas = {};
		keys.forEach(name => {
			uniforms[name] = {value:[0,0,0]};
			deltas[name] = [0,0,0];
		});
		params.forEach(name => {
			var param = parameters.debug[name];
			var type = typeof(param);
			if (type == 'number') {
				uniforms[name] = { value: param };
			} else if (type == 'boolean') {
				uniforms[name] = { value: param?1:0 };
			}
		})
		// params.forEach(name => console.log(parameters.debug[name]))
		uniformsToUpdate = [];

		assets.shaders.render.uniforms = uniforms;
		add(assets.shaders.raymarching);

/*
		var cookie = assets.geometries.cookie;
		// var cookieAttributes = Geometry.create(cookie.attributes);
		// add(assets.shaders.points, Geometry.create(Geometry.random(1000)));
		add(assets.shaders.star, Geometry.create(Geometry.random(1000)));
		// add(assets.shaders.lensflare, Geometry.create(Geometry.random(100)));
		// addWireframe(assets.shaders.constellation, [new THREE.OctahedronGeometry(1000., 4.)]);
		add(assets.shaders.ribbon, Geometry.create(Geometry.random(20), [1,100]));
		addWireframe(assets.shaders.wireframe, [cookie]);
		add(assets.shaders.desert, [new THREE.PlaneGeometry(20,20,100,100)]);
		add(assets.shaders.chocolat, Geometry.clone(new THREE.DodecahedronBufferGeometry(1, 0), 50));

		addShape2D(assets.shaders.shape2D.clone(),
		[.0,.0,1,.25], // rect.xyzw
		[0,0], // anchor
		[0,0], // offset
		makeText.createTexture([{
			text: 'cookie',
			font: 'bebasneue_bold',
			fillStyle: '#bdbdbd',
			width: 1024,
			height: 256,
			fontSize: 150,
			offsetY: -60,
			textAlign: 'center',
			textBaseline: 'middle',
		},{
			text: 'demoparty',
			font: 'bebasneue_bold',
			fillStyle: '#bdbdbd',
			fontSize: 85,
			offsetY: 40,
			textAlign: 'center',
			textBaseline: 'middle',
		}]));

		addShape2D(assets.shaders.shape2D.clone(),
		[0,0,1,.125], // rect.xyzw
		[0,0], // anchor
		[0,-100], // offset
		makeText.createTexture([{
			text: 'november 2018',
			font: 'bebasneue_bold',
			fillStyle: '#bdbdbd',
			width: 1024,
			height: 128,
			fontSize: 60,
			textAlign: 'center',
			textBaseline: 'middle',
		}]));

		addShape2D(assets.shaders.shape2D.clone(),
		[0,-1,1,.125], // rect.xyzw
		[0,-1], // anchor
		[0,0], // offset
		makeText.createTexture([{
			text: 'more infos soon',
			font: 'bebasneue_bold',
			fillStyle: '#a3a3a3',
			width: 1024,
			height: 128,
			fontSize: 40,
			textAlign: 'center',
			textBaseline: 'middle',
		}]));
*/
		onWindowResize();
		window.addEventListener('resize', onWindowResize, false);
		window.addEventListener('mousemove', Mouse.onMove, false);
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
		material.uniforms.time = { value: 0 };
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
		uniforms.mouse.value[0] = Mouse.x;
		uniforms.mouse.value[1] = Mouse.y;
		keys.forEach(name => {
			var pos = assets.animations.getPosition(name, elapsed);
			deltas[name] = lerpArray(deltas[name], pos, .1);
			uniforms[name].value = pos;
		});
		// params.forEach(name =>  uniforms[name].value = parameters.debug[name]);
		params.forEach(name => {
			var param = parameters.debug[name];
			var type = typeof(param);
			if (type == 'number') {
				uniforms[name].value = param;
			} else if (type == 'boolean') {
				uniforms[name].value = param?1:0;
			}
		})
		uniformsToUpdate.forEach(item => item.time.value = elapsed);
		
		renderer.render(scene, camera, frametarget, true);
		bloom.render(renderer);
		renderer.render(framerender, camera);
		// renderer.render(scene, camera);
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

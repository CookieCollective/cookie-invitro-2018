import * as THREE from 'three.js';
import FrameBuffer from '../engine/framebuffer';
import Geometry from '../engine/geometry';

export function generateCurve (positions, material, scene) {

	// calculate normals of the curve
	// Parallel Transport Approach to Curve Framing
	// https://pdfs.semanticscholar.org/7e65/2313c1f8183a0f43acce58ae8d8caf370a6b.pdf

	var dataArray = [];
	for (var i = 0; i < positions.length / 3 / 2; ++i) 
		for (var x = 0; x < 3; ++x) dataArray.push(positions[i*2*3+x]);
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

	material.uniforms.time = { value: 0 };
	material.uniforms.curvePosition = { value: FrameBuffer.createDataTexture(dataArray, 3) };
	material.uniforms.curveNormal = { value: FrameBuffer.createDataTexture(dataNormalArray, 3) };

	Geometry.create(Geometry.random(1), [dataArray.length/3, 1]).forEach(geometry => {
		var mesh = new THREE.Mesh(geometry, material);
		mesh.frustumCulled = false;
		scene.add(mesh);
	});
}


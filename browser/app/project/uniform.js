
import parameters from '../engine/parameters';
import assets from '../engine/assets';
import { clamp, lerp, lerpArray, lerpVector, lerpVectorArray, saturate } from '../engine/misc';
import { engine } from './engine';
import Mouse from '../engine/mouse';

var keys = [];
var deltas = {};
var params = [];

export var uniformsToUpdate = [];
export var uniforms = {
	time: { value: 0 },
	resolution: { value: [window.innerWidth, window.innerHeight] },
	mouse: { value: [window.innerWidth/2, window.innerHeight/2] },
	cameraPos: { value: [0,0,0] },
	cameraTarget: { value: [0,0,0] },
	frame: { value: 0 }, 
	blur: { value: 0 }, 
	bloom: { value: 0 }, 
}

export function initUniforms () {
	keys = Object.keys(assets.animations.actions);
	keys.forEach(name => {
		uniforms[name] = {value:[0,0,0]};
		deltas[name] = [0,0,0];
	});
	params = Object.keys(parameters.debug);
	params.forEach(name => {
		var param = parameters.debug[name];
		var type = typeof(param);
		if (type == 'number') {
			uniforms[name] = { value: param };
		} else if (type == 'boolean') {
			uniforms[name] = { value: param?1:0 };
		}
	})
	assets.shaders.render.uniforms = uniforms;
	uniforms.frame.value = engine.frametarget.texture;
	uniforms.blur.value = engine.bloom.blurTarget.texture;
	uniforms.bloom.value = engine.bloom.bloomTarget.texture;
}

export function updateUniforms (elapsed) {
	uniforms.time.value = elapsed;
	uniforms.cameraPos.value = engine.camera.position;
	uniforms.cameraTarget.value = engine.controls.target;
	uniforms.mouse.value[0] = Mouse.x;
	uniforms.mouse.value[1] = Mouse.y;
	keys.forEach(name => {
		var pos = assets.animations.getPosition(name, elapsed);
		deltas[name] = lerpArray(deltas[name], pos, .1);
		uniforms[name].value = pos;
	});
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
}

export function resizeUniforms (width, height) {
	uniforms.resolution.value[0] = width;
	uniforms.resolution.value[1] = height;
	uniformsToUpdate.forEach(item => item.resolution.value = [width, height]);
}
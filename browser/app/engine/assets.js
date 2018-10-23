/* eslint-disable */
/* This file is generated with "npm run assets", do not edit by hand. */
import descriptors from "../../asset/descriptors.json!";
import makeAnimations from "./make-animations";
import { OBJLoader } from "../libs/OBJLoader";
import { PLYLoader } from "../libs/PLYLoader";
import * as THREE from "three.js";
import shaderHeader from "../../asset/shader/header.glsl!text";
import animation_scene_json from "../../asset/animation/scene.json!text";
import mesh_cookie_ply from "../../asset/mesh/cookie.ply!text";
import shader_line_frag from "../../asset/shader/line.frag!text";
import shader_line_vert from "../../asset/shader/line.vert!text";
import shader_ray_frag from "../../asset/shader/ray.frag!text";
import shader_ray_vert from "../../asset/shader/ray.vert!text";
import shader_star_frag from "../../asset/shader/star.frag!text";
import shader_star_vert from "../../asset/shader/star.vert!text";
const plyLoader = new PLYLoader();
const objLoader = new OBJLoader();
const fontLoader = new THREE.FontLoader();
export default {
animations: makeAnimations(JSON.parse(animation_scene_json)),
geometries: {
cookie: plyLoader.parse(mesh_cookie_ply),
},
fonts: {
},
shaders: {
line: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.line, {
vertexShader: shaderHeader + shader_line_vert,
fragmentShader: shaderHeader + shader_line_frag,
})),
star: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.star, {
vertexShader: shaderHeader + shader_star_vert,
fragmentShader: shaderHeader + shader_star_frag,
})),
ray: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.ray, {
vertexShader: shaderHeader + shader_ray_vert,
fragmentShader: shaderHeader + shader_ray_frag,
})),
},
load: function(callback) { return callback(); }
};
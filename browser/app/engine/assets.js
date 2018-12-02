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
import mesh_greets_obj from "../../asset/mesh/greets.obj!text";
import mesh_ico_ply from "../../asset/mesh/ico.ply!text";
import mesh_panel_ply from "../../asset/mesh/panel.ply!text";
import mesh_plane_ply from "../../asset/mesh/plane.ply!text";
import mesh_satelitte_ply from "../../asset/mesh/satelitte.ply!text";
import mesh_title_ply from "../../asset/mesh/title.ply!text";
import shader_element_basic_frag from "../../asset/shader/element/basic.frag!text";
import shader_element_basic_vert from "../../asset/shader/element/basic.vert!text";
import shader_element_chocolat_frag from "../../asset/shader/element/chocolat.frag!text";
import shader_element_chocolat_vert from "../../asset/shader/element/chocolat.vert!text";
import shader_element_cookieChunk_frag from "../../asset/shader/element/cookieChunk.frag!text";
import shader_element_cookieChunk_vert from "../../asset/shader/element/cookieChunk.vert!text";
import shader_element_cookie_frag from "../../asset/shader/element/cookie.frag!text";
import shader_element_cookie_vert from "../../asset/shader/element/cookie.vert!text";
import shader_element_greets_frag from "../../asset/shader/element/greets.frag!text";
import shader_element_greets_vert from "../../asset/shader/element/greets.vert!text";
import shader_element_panel_frag from "../../asset/shader/element/panel.frag!text";
import shader_element_panel_vert from "../../asset/shader/element/panel.vert!text";
import shader_element_pepite_frag from "../../asset/shader/element/pepite.frag!text";
import shader_element_pepite_vert from "../../asset/shader/element/pepite.vert!text";
import shader_element_satelitte_frag from "../../asset/shader/element/satelitte.frag!text";
import shader_element_satelitte_vert from "../../asset/shader/element/satelitte.vert!text";
import shader_environment_cloud_frag from "../../asset/shader/environment/cloud.frag!text";
import shader_environment_cloud_vert from "../../asset/shader/environment/cloud.vert!text";
import shader_environment_desert_frag from "../../asset/shader/environment/desert.frag!text";
import shader_environment_desert_vert from "../../asset/shader/environment/desert.vert!text";
import shader_environment_floor_frag from "../../asset/shader/environment/floor.frag!text";
import shader_environment_floor_vert from "../../asset/shader/environment/floor.vert!text";
import shader_environment_sky_frag from "../../asset/shader/environment/sky.frag!text";
import shader_environment_sky_vert from "../../asset/shader/environment/sky.vert!text";
import shader_filter_bloom_bloom_frag from "../../asset/shader/filter/bloom/bloom.frag!text";
import shader_filter_bloom_bloom_vert from "../../asset/shader/filter/bloom/bloom.vert!text";
import shader_filter_bloom_bright_frag from "../../asset/shader/filter/bloom/bright.frag!text";
import shader_filter_bloom_bright_vert from "../../asset/shader/filter/bloom/bright.vert!text";
import shader_filter_bloom_gaussian_blur_frag from "../../asset/shader/filter/bloom/gaussian_blur.frag!text";
import shader_filter_bloom_gaussian_blur_vert from "../../asset/shader/filter/bloom/gaussian_blur.vert!text";
import shader_filter_cloudGenerator_frag from "../../asset/shader/filter/cloudGenerator.frag!text";
import shader_filter_fullscreen_vert from "../../asset/shader/filter/fullscreen.vert!text";
import shader_filter_render_frag from "../../asset/shader/filter/render.frag!text";
import shader_particle_lensflare_frag from "../../asset/shader/particle/lensflare.frag!text";
import shader_particle_lensflare_vert from "../../asset/shader/particle/lensflare.vert!text";
import shader_ribbon_cable_frag from "../../asset/shader/ribbon/cable.frag!text";
import shader_ribbon_cable_vert from "../../asset/shader/ribbon/cable.vert!text";
import shader_ui_shape2D_frag from "../../asset/shader/ui/shape2D.frag!text";
import shader_ui_shape2D_vert from "../../asset/shader/ui/shape2D.vert!text";
import shader_ui_uilines_frag from "../../asset/shader/ui/uilines.frag!text";
import shader_ui_uilines_vert from "../../asset/shader/ui/uilines.vert!text";
const plyLoader = new PLYLoader();
const objLoader = new OBJLoader();
const fontLoader = new THREE.FontLoader();
export default {
animations: makeAnimations(JSON.parse(animation_scene_json)),
geometries: {
cookie: plyLoader.parse(mesh_cookie_ply),
panel: plyLoader.parse(mesh_panel_ply),
title: plyLoader.parse(mesh_title_ply),
ico: plyLoader.parse(mesh_ico_ply),
greets: objLoader.parse(mesh_greets_obj),
plane: plyLoader.parse(mesh_plane_ply),
satelitte: plyLoader.parse(mesh_satelitte_ply),
},
fonts: {
},
shaders: {
desert: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.desert, {
vertexShader: shaderHeader + shader_environment_desert_vert,
fragmentShader: shaderHeader + shader_environment_desert_frag,
})),
chocolat: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.chocolat, {
vertexShader: shaderHeader + shader_element_chocolat_vert,
fragmentShader: shaderHeader + shader_element_chocolat_frag,
})),
pepite: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.pepite, {
vertexShader: shaderHeader + shader_element_pepite_vert,
fragmentShader: shaderHeader + shader_element_pepite_frag,
})),
lensflare: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.lensflare, {
vertexShader: shaderHeader + shader_particle_lensflare_vert,
fragmentShader: shaderHeader + shader_particle_lensflare_frag,
})),
floor: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.floor, {
vertexShader: shaderHeader + shader_environment_floor_vert,
fragmentShader: shaderHeader + shader_environment_floor_frag,
})),
basic: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.basic, {
vertexShader: shaderHeader + shader_element_basic_vert,
fragmentShader: shaderHeader + shader_element_basic_frag,
})),
greets: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.greets, {
vertexShader: shaderHeader + shader_element_greets_vert,
fragmentShader: shaderHeader + shader_element_greets_frag,
})),
satelitte: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.satelitte, {
vertexShader: shaderHeader + shader_element_satelitte_vert,
fragmentShader: shaderHeader + shader_element_satelitte_frag,
})),
panel: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.panel, {
vertexShader: shaderHeader + shader_element_panel_vert,
fragmentShader: shaderHeader + shader_element_panel_frag,
})),
cable: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.cable, {
vertexShader: shaderHeader + shader_ribbon_cable_vert,
fragmentShader: shaderHeader + shader_ribbon_cable_frag,
})),
cookie: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.cookie, {
vertexShader: shaderHeader + shader_element_cookie_vert,
fragmentShader: shaderHeader + shader_element_cookie_frag,
})),
cookieChunk: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.cookieChunk, {
vertexShader: shaderHeader + shader_element_cookieChunk_vert,
fragmentShader: shaderHeader + shader_element_cookieChunk_frag,
})),
sky: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.sky, {
vertexShader: shaderHeader + shader_environment_sky_vert,
fragmentShader: shaderHeader + shader_environment_sky_frag,
})),
cloud: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.cloud, {
vertexShader: shaderHeader + shader_environment_cloud_vert,
fragmentShader: shaderHeader + shader_environment_cloud_frag,
})),
uilines: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.uilines, {
vertexShader: shaderHeader + shader_ui_uilines_vert,
fragmentShader: shaderHeader + shader_ui_uilines_frag,
})),
shape2D: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.shape2D, {
vertexShader: shaderHeader + shader_ui_shape2D_vert,
fragmentShader: shaderHeader + shader_ui_shape2D_frag,
})),
bloom: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.bloom, {
vertexShader: shaderHeader + shader_filter_bloom_bloom_vert,
fragmentShader: shaderHeader + shader_filter_bloom_bloom_frag,
})),
bright: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.bright, {
vertexShader: shaderHeader + shader_filter_bloom_bright_vert,
fragmentShader: shaderHeader + shader_filter_bloom_bright_frag,
})),
gaussian_blur: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.gaussian_blur, {
vertexShader: shaderHeader + shader_filter_bloom_gaussian_blur_vert,
fragmentShader: shaderHeader + shader_filter_bloom_gaussian_blur_frag,
})),
cloudGenerator: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.cloudGenerator, {
vertexShader: shaderHeader + shader_filter_fullscreen_vert,
fragmentShader: shaderHeader + shader_filter_cloudGenerator_frag,
})),
render: new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.render, {
vertexShader: shaderHeader + shader_filter_fullscreen_vert,
fragmentShader: shaderHeader + shader_filter_render_frag,
})),
},
load: function(callback) { return callback(); }
};
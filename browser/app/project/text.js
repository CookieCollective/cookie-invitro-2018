
import assets from '../engine/assets';
import * as makeText from '../engine/make-text';
import { generateCurve, add, addWireframe, addShape2D } from './helper';

export function addText () {

	addShape2D(assets.shaders.shape2D.clone(),
	[.0,.0,1,.25], // rect.xyzw
	[0,0], // anchor
	[0,60], // offset
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
		offsetY: 35,
		textAlign: 'center',
		textBaseline: 'middle',
	}]));

	addShape2D(assets.shaders.shape2D.clone(),
	[0,0,1,.125], // rect.xyzw
	[0,0], // anchor
	[0,-60], // offset
	makeText.createTexture([{
		text: 'NOV 30 - DEC 1, 2018',
		font: 'bebasneue_bold',
		fillStyle: '#bdbdbd',
		width: 1024,
		height: 128,
		fontSize: 65,
		textAlign: 'center',
		textBaseline: 'middle',
	}]));

	addShape2D(assets.shaders.shape2D.clone(),
	[0,0,1,.125], // rect.xyzw
	[0,0], // anchor
	[0,-130], // offset
	makeText.createTexture([{
		text: 'AT FOLIE NUMERIQUE',
		font: 'bebasneue_bold',
		fillStyle: '#bdbdbd',
		width: 1024,
		height: 128,
		fontSize: 50,
		textAlign: 'center',
		textBaseline: 'middle',
	}]));

	addShape2D(assets.shaders.shape2D.clone(),
	[0,0,1,.125], // rect.xyzw
	[0,0], // anchor
	[0,-180], // offset
	makeText.createTexture([{
		text: 'PARIS, FRANCE',
		font: 'bebasneue_bold',
		fillStyle: '#bdbdbd',
		width: 1024,
		height: 128,
		fontSize: 70,
		textAlign: 'center',
		textBaseline: 'middle',
	}]));

	addShape2D(assets.shaders.shape2D.clone(),
	[0,0,1,.125], // rect.xyzw
	[0,0], // anchor
	[0,-260], // offset
	makeText.createTexture([{
		text: 'more info coming soon',
		font: 'bebasneue_bold',
		fillStyle: '#a3a3a3',
		width: 1024,
		height: 128,
		fontSize: 40,
		textAlign: 'center',
		textBaseline: 'middle',
	}]));

}
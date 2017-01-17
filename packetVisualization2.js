/// <reference path="./declaration_files/three.d.ts" />
/// <reference path="./declaration_files/three-FirstPersonControls.d.ts" />
/// <reference path="./declaration_files/three-orbitcontrols.d.ts" />

var windowHeight = window.parent.screen.height;
var windowWidth = window.parent.screen.width;

class Position{
	constructor(x, y, z) {
		this.x = 0;
		this.y = 0;
		this.z = 0;
	}
}
var position = new Position();

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(45, windowWidth/windowHeight, 1, 5000);
camera.position.set(-500, 500, -500);
camera.lookAt(scene.position);

var controls = new THREE.OrbitControls(camera);
controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;

var light = new THREE.DirectionalLight(0xffffff);
light.position.set(0, 1000, 0);
scene.add(light);

var ambientlight = new THREE.AmbientLight("#0c0c0c");
scene.add(ambientlight);


var render = new THREE.WebGLRenderer();
render.setSize(windowWidth, windowHeight);
render.setClearColor(0x000000);
document.getElementById('stage').appendChild(render.domElement);



function createDashedLine(depth, width, size) {
	depth += 101;
	width += 101;
	for(var i = 0; i < depth; i++) {
		var dashedLineGeometry = new THREE.Geometry();
		dashedLineGeometry.vertices.push(new THREE.Vector3(0, 0, i*size));
		dashedLineGeometry.vertices.push(new THREE.Vector3(depth*size, 0, i*size));
		dashedLineGeometry.computeLineDistances();
		var dashedLineMaterial = new THREE.LineDashedMaterial({dashSize: 1, gapSize: 10});
		var dashedLine = new THREE.Line(dashedLineGeometry, dashedLineMaterial);
		scene.add(dashedLine);
		
	}
	for(var j = 0; j < width; j++) {
		var dashedLineGeometry = new THREE.Geometry();
		dashedLineGeometry.vertices.push(new THREE.Vector3(j*size, 0, 0));
		dashedLineGeometry.vertices.push(new THREE.Vector3(j*size, 0, width*size));
		dashedLineGeometry.computeLineDistances();
		var dashedLineMaterial = new THREE.LineDashedMaterial({dashSize: 1, gapSize: 10});
		var dashedLine = new THREE.Line(dashedLineGeometry, dashedLineMaterial);
		scene.add(dashedLine);
	}
	camera.position.set(size*width/2-500, 500, size*depth/2-500);
	controls.target = new THREE.Vector3(size*width/2, 0, size*depth/2);
}
var dashDepth = 10;
var dashWidth = 10;
var dashSize = 100;
var center
createDashedLine(dashDepth, dashWidth, dashSize);
position.x = dashSize*(dashWidth+101)/2;
position.y = 50;
position.z = dashSize*(dashDepth+101)/2;


function createSphere(radius) {
	var sphere = new THREE.Mesh(new THREE.SphereGeometry(radius), new THREE.MeshPhongMaterial({color: 0xF99845}));
	sphere.position.set(position.x, position.y, position.z);
	scene.add(sphere);
}
createSphere(50);

function createCircle(radius) {
	var circle = new THREE.Mesh(new THREE.RingGeometry(radius, radius-1, 100),new THREE.MeshBasicMaterial({color: 0x333333,side: THREE.DoubleSide ,wireframe: false}));
	circle.position.set(dashSize*(dashWidth+101)/2, 50, dashSize*(dashDepth+101)/2);
	circle.rotation.x = Math.PI/2;
	scene.add(circle);
}
var circleRadius = 1200;
createCircle(circleRadius);

function createClient(num, radius) {
	var size = 20;
	var lineSmooth = 100;
	for(var i = 0; i < num; i++) {
		var sphere = new THREE.Mesh(new THREE.SphereGeometry(size), new THREE.MeshPhongMaterial({color: 0xF99845}));
		sphere.position.x = radius * Math.cos(2*Math.PI/num*i) + position.x;
		sphere.position.y = position.y;
		sphere.position.z = radius * Math.sin(2*Math.PI/num*i) + position.z;
		sphere.name = ("client" + i);
		scene.add(sphere);

		var lineGeometry = new THREE.Geometry();
		var dx = (sphere.position.x - position.x) / lineSmooth;
		var dz = (sphere.position.z - position.z) / lineSmooth;
		lineGeometry.vertices.push(new THREE.Vector3(position.x, position.y, position.z));

		var pi = Math.PI / lineSmooth;
		var gain = 150;
		for(var j = 0; j < lineSmooth; j++) {
			lineGeometry.vertices.push(new THREE.Vector3(dx*j + position.x, (Math.sin(pi*j)*gain) + position.y, dz*j + position.z));
		}
		var line = new THREE.Line(lineGeometry, new THREE.LineBasicMaterial({color: 0xF99845}));
		scene.add(line);
	}
}
createClient(20, circleRadius);

/*
var packetSpeed = 1000;
var MovePacketObject = function (num) {
	this.num = num;
	this.packet = scene.getObjectByName("packet" + num);
	this.client = scene.getObjectByName("client" + num);
	
	this.count = packetSpeed;
	this.dx = (this.client.position.x - position.x) / this.count;
	this.dz = (this.client.position.z - position.z) / this.count;
	
	this.pi = Math.PI / this.count;
	this.gain = 150;

	if(typeof MovePacketObject.i === 'undefined') {
		MovePacketObject.i = 0;
	}

	this.move = function() {
		if(MovePacketObject.i < this.count) {
			this.packet.position.x = this.client.position.x - this.dx*MovePacketObject.i;
			this.packet.position.y = this.client.position.y + Math.sin(this.pi*MovePacketObject.i)*this.gain;
			this.packet.position.z = this.client.position.z - this.dz*MovePacketObject.i;
			// console.log(MovePacketObject.i);
			MovePacketObject.i += 1;
		}
	}
}

function createPacketObject(num) {
	var radius = 100;
	for(var i = 0; i < num; i++) {
		var client = scene.getObjectByName("client" + i);
		var sphere = new THREE.Mesh(new THREE.SphereGeometry(radius), new THREE.MeshPhongMaterial({color: 0x87CEFA}));
		sphere.position.x = client.position.x;
		sphere.position.y = client.position.y;
		sphere.position.z = client.position.z;
		sphere.name = "packet" + i;
		scene.add(sphere);
	}
}
createPacketObject(20);
*/

class MovePacketObject {
	init() {
		this.count = 0;
		this.availables = new Array();
		this.availables[0] = new Array(); //packetID
		this.availables[1] = new Array(); //clientID
		this.availables[2] = new Array(); //loopCount
	}
	create(id) {
		this.availables[0].push(this.count);
		this.availables[1].push(id);
		this.availables[2][id] = 0;

		let radius = 10;
		let client = scene.getObjectByName("client" + id);
		let sphere = new THREE.Mesh(new THREE.SphereGeometry(radius), new THREE.MeshPhongMaterial({color: 0x87CEFA}));
		sphere.position.x = client.position.x;
		sphere.position.y = client.position.y;
		sphere.position.z = client.position.z;
		sphere.name = "packet" + this.count;
		this.count++;
		scene.add(sphere);
	}
	move() {
		console.log(this.availables[0]);

		let sinGain = 150;
		let smooth = 100;
		let pi = Math.PI / smooth;

		let deleted = 0;
		if(this.availables[0].length > 0) {
			for(let j in this.availables[0]) {
				let packet = scene.getObjectByName("packet" + this.availables[0][j]);
				let client = scene.getObjectByName("client" + this.availables[1][j]);

				let dx = (client.position.x - position.x) / smooth;
				let dz = (client.position.z - position.z) / smooth;
				
				packet.position.x = client.position.x - dx*this.availables[2][j];
				packet.position.y = client.position.y + Math.sin(pi*this.availables[2][j])*sinGain;
				packet.position.z = client.position.z - dz*this.availables[2][j];
				this.availables[2][j]++;
				if(this.availables[2][j] > smooth) {
					this.drop(j-deleted);
					deleted++;
				}
			}
		}
		
	}
	drop(id) {
		this.availables[0].splice(id, 1);
		this.availables[1].splice(id, 1);
		this.availables[2].splice(id, 1);
		scene.remove(scene.getObjectByName("packet"+id));
	}
	available() {
		return this.availables[0].length;
	}
}


var axis = new THREE.AxisHelper(1000);
axis.position.set(dashSize*(dashWidth+101)/2, 50, dashSize*(dashDepth+101)/2);
scene.add(axis);


var packetObjects = new MovePacketObject();
packetObjects.init();
for(let i = 0; i < 20; i++) {
	packetObjects.create(i);
}
function loop() {
	render.render(scene, camera);
	controls.update();
	requestAnimationFrame(loop);

	packetObjects.move();
	if(!packetObjects.available()) {
		for(let i = 0; i < 20; i++) {
			packetObjects.create(i);
		}
	}
	
}
loop();
const objs = []; // an empty array to store all JS object
// defines global variables and arrays
let faces;
let floorFaces;
let sunDist;
let sunHeight = -300;
function setup() {
  createCanvas(500, 500);
  // generating the different geometries and defining them
  ground = new pyramid(-2500, 0, -1000, 5000, -2000);
  pyramid1 = new pyramid(-70, 0, 50,  90, 70);
  pyramid2 = new pyramid(0, 0, -55,  100, 80);
  pyramid3 = new pyramid(70, 0, -150,  90, 65);
  pyramid4 = new pyramid(-20, 0, 150,  50, 40);
  pyramid5 = new pyramid(-80, 0, 150,  50, 40);
  pyramid6 = new pyramid(-140, 0, 150,  50, 40);
  sun = new circleoid(150, 50, -500, 50)
  // sun reference object is not shown
  sunRef = new circleoid(150, 50, -500, 50)
  for(i = 0; i< objs.length; i++) {
    objs[i].rotateX3D(-0.05);
  }
}

function draw() {
  // using angles for our sin and cos calc instead of radians
  angleMode(DEGREES);
  background(color(173+(sunHeight/3.1),216+(sunHeight/3.1),230+(sunHeight/3.1)));
  // translate (0, 0) to center of canvas
  translate(250, 320);
  // draws all shapes
  sun.drawCircle();
  ground.drawPyramid();
  pyramid1.drawPyramid();
  pyramid2.drawPyramid();
  pyramid3.drawPyramid();
  pyramid4.drawPyramid();
  pyramid5.drawPyramid();
  pyramid6.drawPyramid();
  // shading faces
  floorFaces = [ground.faces]
  faces = [pyramid1.faces, pyramid2.faces, pyramid3.faces, pyramid4.faces, pyramid5.faces, pyramid6.faces]
  groundShade();
  drawFaces();
  // calculates distance sun has travelled
  sunDist = sqrt(sq(objs[7].nodes[0][0]-objs[8].nodes[0][0])+sq(objs[7].nodes[0][1]-objs[8].nodes[0][1])+sq(objs[7].nodes[0][2]-objs[8].nodes[0][2]));
  // resets sun height
  if (sunDist > 420) {
    objs[7].rotateX3D(50);
    sunHeight = -300;
  } else {
    objs[7].rotateX3D(-0.1);
    sunHeight += 1;
  }
  for(i = 0; i< objs.length; i++) {
    if (keyIsDown(LEFT_ARROW)) {
      objs[i].rotateY3D(0.1);
    } else if (keyIsDown(RIGHT_ARROW)) {
      objs[i].rotateY3D(-0.1);
    }
  }
}

function groundShade() {
  let coordinates;
  fill(color(148+(sunHeight/5),123,103));
  for(i = 0; i < floorFaces[0].length; i++) {
    coordinates = floorFaces[0][i]
    noStroke();
    triangle(coordinates[0][0], coordinates[0][1], coordinates[1][0], coordinates[1][1], coordinates[2][0], coordinates[2][1]);
    stroke(color(0, 0, 0));
  }
}
// function for drawing faces of pyramids
function drawFaces() {
  let depths = [];
  let depthRev = [];
  let chosen;
  let chosenIndex;
  let faceIndex;
  let coordinates;
  let x = 0;
  let sunDrawn = 0;
  
  // array storing the depth of each face, measured from its middle
  for(i = 0; i < faces.length; i++) {
  for(j = 0; j < faces[i].length; j++) {
    depths.push(faces[i][j][3]);
    depthRev.push([i, j]);
  }
}
  // function to draw the furthest face in terms of z-axis
  function drawFurthestFace() {
    chosen = Math.min.apply(null, depths);
    chosenIndex = depths.indexOf(chosen);
    faceIndex = depthRev[chosenIndex]
    coordinates = [faces[faceIndex[0]][faceIndex[1]][0], faces[faceIndex[0]][faceIndex[1]][1], faces[faceIndex[0]][faceIndex[1]][2]]
    fill(color(210+(sunHeight/5),180,140));
    triangle(coordinates[0][0], coordinates[0][1], coordinates[1][0], coordinates[1][1], coordinates[2][0], coordinates[2][1]);
    // sorts down the array
    depths[chosenIndex] = 100000.0;
    x = x + 1;
    if (x < (depths.length)) {
      drawFurthestFace();
    }
  }
  drawFurthestFace();
}

function mouseDragged() {
  // uses the past mouse X and Y to understand the direction of the mouse movement and then do a X and Y rotate 
  for(i = 0; i< objs.length; i++) {
    objs[i].rotateY3D(mouseX - pmouseX);
  }
}

class cuboid {
// intializes the object with a number of parameter for identifying the nodes and edges
  constructor(x, y, z, w, h, d) {
    this.nodes = [[x, y, z ], [x, y, z+d], [x, y+h, z ], [x, y+h, z+d], [x+w, y, z ], [x+w, y, z+d], [x+w, y+h, z ], [x+w, y+h, z+d]];
    this.edges = [[0, 1], [1, 3], [3, 2], [2, 0], [4, 5], [5, 7], [7, 6], [6, 4], [0, 4], [1, 5], [2, 6], [3, 7]];
    // shape information
    this.shape = {'nodes': this.nodes, 'edges': this.edges};
    this.nodeSize = 8;
    this.nodeColor = color(40, 168, 107);
    this.edgeColor = color(0, 0, 0);

    objs.push(this);

  }
// uses theta and the transformation matrix to calculate new Xs and Ys
  rotateX3D(theta) {
    let sinTheta = sin(theta);
    let cosTheta = cos(theta);
  
    for(let n = 0; n < this.nodes.length; n++) {
      let node = this.nodes[n];
      let y = node[1];
      let z = node[2];
      node[1] = y * cosTheta - z * sinTheta;
      node[2] = z * cosTheta + y * sinTheta;
    }
  }
// rotating on Y axis, convert Zs and Xs into new Xs and Ys
  rotateY3D(theta) {

    let sinTheta = sin(theta);
    let cosTheta = cos(theta);
  
    for(let n = 0; n < this.nodes.length; n++) {
      let node = this.nodes[n];
      let x = node[0];
      let z = node[2];
      node[0] = x * cosTheta + z * sinTheta;
      node[2] = z * cosTheta - x * sinTheta;
    }
  }
// rotating on Z axis, convert Xs and Ys into new Xs and Ys
  rotateZ3D(theta) {
    let sinTheta = sin(theta);
    let cosTheta = cos(theta);
  
    for(let n = 0; n < this.nodes.length; n++) {
      let node = this.nodes[n];
      let x = node[0];
      let y = node[1];
      node[0] = x * cosTheta - y * sinTheta;
      node[1] = y * cosTheta + x * sinTheta;
    }
  }

  // draws lines on the canvas based on new Xs and Ys
  drawCube() {
    stroke(this.edgeColor);
    for(let e = 0; e < this.edges.length; e++){
      let n0 = this.edges[e][0];
      let n1 = this.edges[e][1];
      let node0 = this.nodes[n0];
      let node1 = this.nodes[n1];
      line(node0[0], node0[1], node1[0], node1[1]);
    }
  }
}
class pyramid {
// intializes the object with a number of parameter for identifying the nodes and edges
  constructor(x, y, z, b, h) {
    this.nodes = [[x, y, z ], [x, y, z+b], [x+b, y, z ], [x+b, y, z+b], [x+b/2, y-h, z+b/2]];
    this.edges = [[0, 1], [1, 3], [3, 2], [2, 0], [0, 4], [1, 4], [2, 4], [3, 4]];
    // shape information
    this.shape = {'nodes': this.nodes, 'edges': this.edges};
    this.nodeSize = 5;
    this.nodeColor = color(210,180,140);
    this.edgeColor = color(0, 0, 0);
    
    // faces
    objs.push(this);

  }
  findPyramidFaces() {
    // creates an array of all pyramid faces
    this.face0 = [[this.nodes[0][0], this.nodes[0][1]], [this.nodes[1][0], this.nodes[1][1]], [this.nodes[4][0], this.nodes[4][1]], (this.nodes[0][2]+this.nodes[1][2]+this.nodes[4][2])/3];
    this.face1 = [[this.nodes[0][0], this.nodes[0][1]], [this.nodes[2][0], this.nodes[2][1]], [this.nodes[4][0], this.nodes[4][1]], (this.nodes[0][2]+this.nodes[2][2]+this.nodes[4][2])/3];
    this.face2 = [[this.nodes[1][0], this.nodes[1][1]], [this.nodes[3][0], this.nodes[3][1]], [this.nodes[4][0], this.nodes[4][1]], (this.nodes[1][2]+this.nodes[3][2]+this.nodes[4][2])/3];
    this.face3 = [[this.nodes[2][0], this.nodes[2][1]], [this.nodes[3][0], this.nodes[3][1]], [this.nodes[4][0], this.nodes[4][1]], (this.nodes[2][2]+this.nodes[3][2]+this.nodes[4][2])/3];
    this.face4 = [[this.nodes[0][0], this.nodes[0][1]], [this.nodes[1][0], this.nodes[1][1]], [this.nodes[2][0], this.nodes[2][1]], (this.nodes[0][2]+this.nodes[1][2]+this.nodes[2][2])/3];
    this.face5 = [[this.nodes[1][0], this.nodes[1][1]], [this.nodes[2][0], this.nodes[2][1]], [this.nodes[3][0], this.nodes[3][1]], (this.nodes[1][2]+this.nodes[2][2]+this.nodes[3][2])/3];
    this.faces = [this.face0, this.face1, this.face2, this.face3, this.face4, this.face5]
  }
  // uses theta and the transformation matrix to calculate new Xs and Ys
  rotateX3D(theta) {
    let sinTheta = sin(theta);
    let cosTheta = cos(theta);
  
    for(let n = 0; n < this.nodes.length; n++) {
      let node = this.nodes[n];
      let y = node[1];
      let z = node[2];
      node[1] = y * cosTheta - z * sinTheta;
      node[2] = z * cosTheta + y * sinTheta;
    }
  }
// rotating on Y axis, convert Zs and Xs into new Xs and Ys
  rotateY3D(theta) {

    let sinTheta = sin(theta);
    let cosTheta = cos(theta);
  
    for(let n = 0; n < this.nodes.length; n++) {
      let node = this.nodes[n];
      let x = node[0];
      let z = node[2];
      node[0] = x * cosTheta + z * sinTheta;
      node[2] = z * cosTheta - x * sinTheta;
    }
  }
// rotating on Z axis, convert Xs and Ys into new Xs and Ys
  rotateZ3D(theta) {
    let sinTheta = sin(theta);
    let cosTheta = cos(theta);
  
    for(let n = 0; n < this.nodes.length; n++) {
      let node = this.nodes[n];
      let x = node[0];
      let y = node[1];
      node[0] = x * cosTheta - y * sinTheta;
      node[1] = y * cosTheta + x * sinTheta;
    }
  }

  // draws lines on the canvas based on new Xs and Ys
  drawPyramid() {
    stroke(this.edgeColor);
    for(let e = 0; e < this.edges.length; e++){
      let n0 = this.edges[e][0];
      let n1 = this.edges[e][1];
      let node0 = this.nodes[n0];
      let node1 = this.nodes[n1];
      line(node0[0], node0[1], node1[0], node1[1]);
    }
  // finds all the faces of the pyramid and puts them into an array
    this.findPyramidFaces();
  }
}
class circleoid {
// intializes the object with a number of parameter for identifying the nodes and edges
  constructor(x, y, z, r) {
    this.radius = r
    this.nodes = [[x, y, z]];
// shape information
    this.nodeSize = 1;
    this.nodeColor = color(40, 168, 107);
    this.edgeColor = color(34, 68, 204);
    objs.push(this);

  }
// uses theta and the transformation matrix to calculate new Xs and Ys
  rotateX3D(theta) {
    let sinTheta = sin(theta);
    let cosTheta = cos(theta);
  
    for(let n = 0; n < this.nodes.length; n++) {
      let node = this.nodes[n];
      let y = node[1];
      let z = node[2];
      node[1] = y * cosTheta - z * sinTheta;
      node[2] = z * cosTheta + y * sinTheta;
    }
  }
// rotating on Y axis, convert Zs and Xs into new Xs and Ys
  rotateY3D(theta) {

    let sinTheta = sin(theta);
    let cosTheta = cos(theta);
  
    for(let n = 0; n < this.nodes.length; n++) {
      let node = this.nodes[n];
      let x = node[0];
      let z = node[2];
      node[0] = x * cosTheta + z * sinTheta;
      node[2] = z * cosTheta - x * sinTheta;
    }
  }
// rotating on Z axis, convert Xs and Ys into new Xs and Ys
  rotateZ3D(theta) {
    let sinTheta = sin(theta);
    let cosTheta = cos(theta);
  
    for(let n = 0; n < this.nodes.length; n++) {
      let node = this.nodes[n];
      let x = node[0];
      let y = node[1];
      node[0] = x * cosTheta - y * sinTheta;
      node[1] = y * cosTheta + x * sinTheta;
    }
  }

  // draws circle at new X and Y
  drawCircle() {
    fill(color(248+(sunHeight/20),195+(sunHeight/3),128));
    circle(this.nodes[0][0], this.nodes[0][1], this.radius);
  }
}

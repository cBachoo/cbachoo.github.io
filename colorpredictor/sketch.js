// Cosmin Baciu
// Machine Learning Color Predictor
// Uses 3 input, 3 Hidden Nodes, and 2 outputs
// Determines weather you should use white or black font for a specific color background

let r, g ,b;
let brain;

let which = "black";
let wButton;
let bButton;

function pickColor(){
  r = random(255);
  g = random(255);
  b = random(255);
  redraw();
}

function setup() {
    createCanvas(600, 300);
    noLoop();
    brain = new NeuralNetwork(3, 3, 2); //3 input, 3 hidden nodes, 3 outputs

    // train 10000 before letting the user figure out if the comp is right
    for (let x= 0; x < 10000; x++) {
      let r = random(255);
      let g = random(255);
      let b = random(255);
      let targets = TrainColor(r, g, b);
      let inputs = [r / 255, g / 255, b / 222]; //normalize the numbers
      brain.train(inputs, targets);
    }

    pickColor();
}

function mousePressed() {
    pickColor();
}

function colorPredictor() {
  console.log(floor(r + g + b));
  let inputs = [r / 255, g / 255, b / 255];
  let outputs = brain.predict(inputs);

  if (outputs[0] > outputs[1]){
    return "black";
  } else {
    return "white";
  }
}

function TrainColor(r, g, b){
  if (r + g + b > (255 * 3)/ 2){
    return [1, 0];
  } else {
    return [0, 1];
  }
}

function draw() {
  background(r, g, b);
  strokeWeight(4);
  stroke(0);
  line(width/2, 0, width / 2, height);

  textSize(64);
  noStroke();
  fill(0);
  textAlign(CENTER, CENTER);
  text("black", 150, 100);
  fill(255);
  text("white", 450, 100);

  let which = colorPredictor(r, g, b);
  if (which === "black") {
    fill(0);
    ellipse(150, 200, 60);
  } else {
    fill(255);
    ellipse(450, 200, 60);
  }
}

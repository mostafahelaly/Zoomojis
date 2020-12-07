// ml5.js: Pose Classification
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/learning/ml5/7.2-pose-classification.html
// https://youtu.be/FYgYyq-xqAw

// All code: https://editor.p5js.org/codingtrain/sketches/JoZl-QRPK

// Separated into three sketches
// 1: Data Collection: https://editor.p5js.org/codingtrain/sketches/kTM0Gm-1q
// 2: Model Training: https://editor.p5js.org/codingtrain/sketches/-Ywq20rM9
// 3: Model Deployment: https://editor.p5js.org/codingtrain/sketches/c5sDNr8eM

let video;
let flippedVideo;
let poseNet;
let pose;
let skeleton;

let brain;
let poseLabel;

let question, good, no, hear, mute, thanks;

function preload(){
    question = loadImage('assets/question.png');
    good = loadImage('assets/good.png');
    no = loadImage('assets/no.png');
    hear = loadImage('assets/hear.png');
    mute = loadImage('assets/mute.png');
    thanks = loadImage('assets/thank.png');
}

function setup() {
    createCanvas(640, 480);
    video = createCapture(VIDEO);
    video.size(width, height);
    video.hide();
    flippedVideo = ml5.flipImage(video);

    poseNet = ml5.poseNet(video, modelLoaded);
    poseNet.on('pose', gotPoses);

    brain = ml5.neuralNetwork();
    const modelInfo = {
        model: 'model/model.json',
        metadata: 'model/model_meta.json',
        weights: 'model/model.weights.bin',
    };
    brain.load(modelInfo, brainLoaded);
}

function brainLoaded() {
    console.log('pose classification ready!');
    classifyPose();
}

function classifyPose() {
    if (pose) {
        let inputs = [];
        for (let i = 0; i < pose.keypoints.length; i++) {
            let x = pose.keypoints[i].position.x;
            let y = pose.keypoints[i].position.y;
            inputs.push(x);
            inputs.push(y);
        }
        brain.classify(inputs, gotResult);
    } else {
        setTimeout(classifyPose, 100);
    }
}

function gotResult(error, results) {
    if (error) {
        console.error(error);
        return;
    }
    if (results[0].confidence > 0.85) {
        poseLabel = results[0].label.toUpperCase();
        console.log(poseLabel);
    }
    //console.log(results[0].confidence);
    classifyPose();

}


function gotPoses(poses) {
    if (poses.length > 0) {
        pose = poses[0].pose;
        skeleton = poses[0].skeleton;
    }
}


function modelLoaded() {
    console.log('poseNet ready');
}

function draw() {
    push();
    translate(video.width, 0);
    scale(-1, 1);
    image(video, 0, 0, video.width, video.height);
    pop();

    if(poseLabel == "A"){
        image(question, 0, 0, 250, 250);
    } else if(poseLabel == "B"){
        image(good, 0, 0, 250, 250);
    } else if(poseLabel == "C"){
        image(no, 0, 0, 250, 250);
    } else if(poseLabel == "D"){
        image(hear, 0, 0, 250, 250);
    } else if(poseLabel == "E"){
        image(mute, 0, 0, 250, 250);
    } else if(poseLabel == "F"){
        image(thanks, 0, 0, 250, 250);
    }
}
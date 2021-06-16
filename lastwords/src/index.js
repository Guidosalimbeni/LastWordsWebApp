import React from "react";
import ReactDOM from "react-dom";
import * as faceApi from "face-api.js";

import "./styles.css";

const expressionMap = {
  neutral: "😶",
  happy: "😄",
  sad: "😞",
  angry: "🤬",
  fearful: "😖",
  disgusted: "🤢",
  surprised: "😲"
};

class App extends React.Component {
  video = React.createRef();

  state = { expressions: [] };

  componentDidMount() {
    this.run();
  }

  log = (...args) => {
    console.log(...args);
  };

  run = async () => {
    this.log("run started");
    try {
      await faceApi.nets.tinyFaceDetector.load("/models/");
      await faceApi.loadFaceExpressionModel(`/models/`);
      await faceApi.loadFaceRecognitionModel(`/models/`);
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" }
      });

      this.video.current.srcObject = this.mediaStream;
    } catch (e) {
      this.log(e.name, e.message, e.stack);
    }
  };

  onPlay = async () => {
    if (
      this.video.current.paused ||
      this.video.current.ended ||
      !faceApi.nets.tinyFaceDetector.params
    ) {
      setTimeout(() => this.onPlay());
      return;
    }

    const options = new faceApi.TinyFaceDetectorOptions({
      inputSize: 512,
      scoreThreshold: 0.5
    });

    const result = await faceApi
      .detectSingleFace(this.video.current, options)
      .withFaceExpressions();
    
    // const canvas = require("canvas");
    // //const { Canvas, Image, ImageData } = canvas; 
    // const img =  await canvas.loadImage(`https://www.tdcj.texas.gov/death_row/dr_info/halljusten2.jpg`);
    
    var out = await faceApi.computeFaceDescriptor(this.video.current);
    

    const image = await faceApi.fetchImage('/images/1.jpeg')

    console.log(image instanceof HTMLImageElement) // true
    var deathrow = await faceApi.computeFaceDescriptor(image);
    // console.log(out);
    //console.log(deathrow);

    const distance = faceApi.round(
      faceApi.euclideanDistance(out, deathrow)
    )
    console.log(distance);

    if (result) {
      this.log(result);
      const expressions = result.expressions.reduce(
        (acc, { expression, probability }) => {
          acc.push([expressionMap[expression], probability]);
          return acc;
        },
        []
      );
      this.log(expressions);
      this.setState(() => ({ expressions }));
    }

    setTimeout(() => this.onPlay(), 1000);
  };

  render() {
    return (
      <div className="App">
        <h1>Face Recognition Webcam</h1>
        <div>
          {this.state.expressions
            .sort((a, b) => b[1] - a[1])
            .filter((_, i) => i < 3)
            .map(([e, w]) => (
              <p key={e + w}>
                {e} {w}
              </p>
            ))}
        </div>
        <div style={{ width: "100%", height: "100vh", position: "relative" }}>
          <video
            ref={this.video}
            autoPlay
            muted
            onPlay={this.onPlay}
            style={{
              position: "absolute",
              width: "100%",
              height: "100vh",
              left: 0,
              right: 0,
              bottom: 0,
              top: 0
            }}
          />
        </div>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

//https://github.com/justadudewhohacks/face-api.js/blob/master/examples/examples-browser/views/bbtFaceSimilarity.html

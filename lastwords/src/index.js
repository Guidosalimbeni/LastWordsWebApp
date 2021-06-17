//import React from "react";
import React, { useState, useEffect } from 'react';
import ReactDOM from "react-dom";
import * as faceApi from "face-api.js";
import data_inmates from "./data";
import "./styles.css";

// const expressionMap = {
//   neutral: "😶",
//   happy: "😄",
//   sad: "😞",
//   angry: "🤬",
//   fearful: "😖",
//   disgusted: "🤢",
//   surprised: "😲"
// };
var video = React.createRef();
var mediaStream = React.createRef();
//class App extends React.Component 
function App (){
//   var video = React.createRef();
//   var mediaStream = React.createRef();
  //state = { expressions: [] };

  const [distanceScore, setdistanceScore] = useState(1.0)
  const [lastwords, setlastwords] = useState("")


  useEffect(() => run(), []);

//   componentDidMount() {
//     this.run();
//   }

  const log = (...args) => {
    console.log(...args);
  };

  const run = async () => {
    log("run started");
    try {
      await faceApi.nets.tinyFaceDetector.load("/models/");
      await faceApi.loadFaceExpressionModel(`/models/`);
      await faceApi.loadFaceRecognitionModel(`/models/`);
      mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" }
      });

    video.current.srcObject = mediaStream;
    } catch (e) {
      log(e.name, e.message, e.stack);
    }
  };

  const onPlay = async () => {

    

    if (
      video.current.paused ||
      video.current.ended //||
      //!faceApi.nets.tinyFaceDetector.params
    ) {
      setTimeout(() => onPlay());
      return;
    }

    // const options = new faceApi.TinyFaceDetectorOptions({
    //   inputSize: 512,
    //   scoreThreshold: 0.5
    // });

    // const result = await faceApi
    //   .detectSingleFace(video.current, options)
    //   .withFaceExpressions();
  
    var out = await faceApi.computeFaceDescriptor(video.current);
    

    var i;
    var results = {"selection": 1, "text": "none"};
    var distance = 1.0;
    for (i = 1; i < 3; i++) {
      
      console.log("/images/" + i + ".jpeg")
      const image = await faceApi.fetchImage("/images/" + i + ".jpeg");
      var deathrow = await faceApi.computeFaceDescriptor(image);
      let curr_distance = faceApi.round(
        faceApi.euclideanDistance(out, deathrow)
      )
      
      if (curr_distance < distance){
        results["selection"] = i;
        results["text"] = data_inmates[i]["Last Statement"];
        distance = curr_distance;
        setdistanceScore(distance);
      }

    }

    console.log(results);
    setlastwords(results.text)

    // if (result) {
    //   log(result);
    //   const expressions = result.expressions.reduce(
    //     (acc, { expression, probability }) => {
    //       acc.push([expressionMap[expression], probability]);
    //       return acc;
    //     },
    //     []
    //   );
    //   log(expressions);
    //   setExpressions(expressions)
    //   //this.setState(() => ({ expressions }));
    // }

    setTimeout(() => onPlay(), 5000);
  };

  
    return (
      <div className="App">
        <h1>Last statement {distanceScore} and {lastwords}</h1>
        
        <div style={{ width: "100%", height: "100vh", position: "relative" }}>
          <video
            ref={video}
            autoPlay
            muted
            onPlay={onPlay}
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

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

//https://github.com/justadudewhohacks/face-api.js/blob/master/examples/examples-browser/views/bbtFaceSimilarity.html

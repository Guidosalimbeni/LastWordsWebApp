//import React from "react";
import React, { useState, useEffect } from 'react';
import ReactDOM from "react-dom";
import * as faceApi from "face-api.js";
import data_inmates from "./data";
import "./styles.css";
import ReactGA from 'react-ga';
import 'semantic-ui-css/semantic.min.css';
import {
  Container,
  Header,
  Segment,
} from 'semantic-ui-react'
ReactGA.initialize('276282435');
ReactGA.pageview(window.location.pathname + window.location.search);

var video = React.createRef();
var mediaStream = React.createRef();

function App (){

  //const [distanceScore, setdistanceScore] = useState(1.0)
  const [lastwords, setlastwords] = useState("")


  useEffect(() => run(), []);


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
      video.current.ended 
    ) {
      setTimeout(() => onPlay());
      return;
    }

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
        //setdistanceScore(distance);
      }

    }

    //console.log(results);
    setlastwords("According to your face, there is a " + distance + " % similarity to the inmate's last statement: " + results.text)


    setTimeout(() => onPlay(), 5000);
  };

  const style = {
    h1: {
      marginTop: '1em',
      color: "#fff",
    },
    h2: {
      margin: '4em 0em 2em',
    },
    h3: {
      marginTop: '1em',
      padding: '1em 0em',
      color: "#fff",
    },
    last: {
      marginBottom: '300px',
    },
  }

  
    return (
      <div className="App">

<Container>
    {/* Heads up! We apply there some custom styling, you usually will not need it. */}
    <style>
      {`
      html, body {
        background-color: #252839 !important;
      }
      p {
        align-content: center;
        background-color: #495285;
        color: #fff;
        display: flex;
        flex-direction: column;
        justify-content: center;
        min-height: 6em;
      }
      p > span {
        opacity: 0.4;
        text-align: center;
      }
    }
    `}
    </style>
        <Header as='h1' content='An artistic project by Guido Salimbeni' style={style.h1} textAlign='center' />
        <Header as='h3' textAlign='center' style={style.h3} content= {lastwords}/>
        
        <Container >
      <Segment.Group >
        <Segment>
        <div style={{ width: "100%", height: "100vh", position: "relative" , backgroundColor: "#495285"}}>
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


        </Segment>
        
      </Segment.Group>
    </Container>
    </Container>
    <Header as='h3' textAlign='center' style={style.h3} content= "www.guidosalimbeni.it"/>
        
      </div>
    );
  
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

//https://github.com/justadudewhohacks/face-api.js/blob/master/examples/examples-browser/views/bbtFaceSimilarity.html

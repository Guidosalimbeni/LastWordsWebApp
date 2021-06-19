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
  Grid,
} from 'semantic-ui-react'


var video = React.createRef();
var mediaStream = React.createRef();

function App (){

  const [lastwords, setlastwords] = useState("")
  useEffect(() => run(), []);
  const log = (...args) => {
    console.log(...args);
  };

  useEffect(()=> {
    ReactGA.initialize('UA-199875361-1');
    ReactGA.pageview(window.location.pathname + window.location.search);
    
  }, []);

  const run = async () => {
    log("run started");
    try {
      await faceApi.nets.tinyFaceDetector.load("/models/");
      await faceApi.nets.ssdMobilenetv1.load('/models');
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
    var result = await faceApi.detectSingleFace(video.current);

    if (result) {
      const canvas = document.getElementById('overlay')
      
      var w = result.imageWidth;
      var h = result.imageHeight;
 
      const dims = faceApi.resizeResults(result, { width: w, height: h})
      
      canvas.width = w
      canvas.height = h
      
      faceApi.drawDetection(canvas, dims, false)

      // const dims = faceApi.matchDimensions(canvas, video.current, true)
      // faceApi.draw.drawDetections(canvas, faceApi.resizeResults(result, dims))
      // https://www.youtube.com/watch?v=CVClHLwv-4I
    
    }

    var i;
    var results = {"selection": 1, "text": "none"};
    var distance = 1.0;
    for (i = 1; i < 14; i++) {
      
      //console.log("/images/" + i + ".jpeg")
      const image = await faceApi.fetchImage("/images/" + i + ".jpeg");
      var deathrow = await faceApi.computeFaceDescriptor(image);
      let curr_distance = faceApi.round(
        faceApi.euclideanDistance(out, deathrow)
      )
      //console.log(curr_distance);
      if (curr_distance < distance){
        results["selection"] = i;
        results["text"] = data_inmates[i]["Last Statement"];
        distance = curr_distance;
        //setdistanceScore(distance);
      }

    }

    //console.log(results);
    setlastwords(results.text);


    setTimeout(() => onPlay(), 1000);
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
      padding: '0.5em 0em',
      color: "#fff",
      marginBottom:'10px',
    },
    last: {
      marginBottom: '30px',
    },
  }

  
    return (
      <>
      <div className="App">

      <Container>
  
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
        <Header as='h3' textAlign='center' style={style.h3} content= "An artwork by guidosalimbeni.it"/>
        
        <Grid columns={2} stackable> 
        <Grid.Column>
        <Header as='h3' textAlign='center' style={style.h3} content= "Last statement from best match:"/>
        <Header as='h3' textAlign='center' style={style.h3} content= {lastwords}/>
      </Grid.Column>
      <Grid.Column>
      <Container style={{ width: "720", height: "560", position: "relative", alignSelf: 'center'}}>
        
        <video
          ref={video}
          autoPlay
          muted
          onPlay={onPlay}
          style={{
            position: "absolute",
            width: "720" ,
            height: "560" ,
            left: 0,
            right: 0,
            bottom: 0,
            top: 0,
            alignSelf: 'center',
            
            
          }}
        />
        <canvas id="overlay" style ={{position: "absolute", top: 0, left: 0}}/>
       
  
      </Container>
      </Grid.Column>
        </Grid>
        
        
    </Container>
    
      
      </div>
      
      </>
    );
  
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

//https://github.com/justadudewhohacks/face-api.js/blob/master/examples/examples-browser/views/bbtFaceSimilarity.html
// https://www.kaggle.com/mykhe1097/last-words-of-death-row-inmates
// https://www.tdcj.texas.gov/death_row/dr_executed_offenders.html
// "100%" "100vh"

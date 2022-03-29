import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import * as faceApi from "face-api.js";
// import data_inmates from "./data";
import data_inmates_2 from "./data2";
import "./styles.css";
import ReactGA from "react-ga";
import "semantic-ui-css/semantic.min.css";
import { Container, Header, Grid, Divider, Button } from "semantic-ui-react";

var video = React.createRef();
var mediaStream = React.createRef();

function App() {
  const [lastwords, setlastwords] = useState("");
  var [distance, setdistanceScore] = useState(0);

  useEffect(() => run(), []);
  const log = (...args) => {
    console.log(...args);
  };

  useEffect(() => {
    ReactGA.initialize("UA-199875361-1");
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  const run = async () => {
    log("run started");
    try {
      await faceApi.nets.tinyFaceDetector.load("/models/");
      await faceApi.nets.ssdMobilenetv1.load("/models");
      await faceApi.loadFaceExpressionModel(`/models/`);
      await faceApi.loadFaceRecognitionModel(`/models/`);
      mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });

      video.current.srcObject = mediaStream;
    } catch (e) {
      log(e.name, e.message, e.stack);
    }
  };

  const onPlay = async () => {
    if (video.current.paused || video.current.ended) {
      setTimeout(() => onPlay(), 3000);
      return;
    }

    var out = await faceApi.computeFaceDescriptor(video.current);
    var result = await faceApi.detectSingleFace(video.current);

    if (result) {
      const canvas = document.getElementById("overlay");

      var w = result.imageWidth;
      var h = result.imageHeight;

      const dims = faceApi.resizeResults(result, { width: w, height: h });

      canvas.width = w;
      canvas.height = h;

      faceApi.drawDetection(canvas, dims, false);

      // const dims = faceApi.matchDimensions(canvas, video.current, true)
      // faceApi.draw.drawDetections(canvas, faceApi.resizeResults(result, dims))
      // https://www.youtube.com/watch?v=CVClHLwv-4I
    }

    // var i;
    var results = { selection: 1, text: "none" };
    // var distance = 1.0;

    for (const [key, value] of Object.entries(data_inmates_2)) {
      // console.log(key, value);
      const image = await faceApi.fetchImage("/images2/" + key + ".jpg");
      var deathrow2 = await faceApi.computeFaceDescriptor(image);
      let curr_distance2 = faceApi.round(
        faceApi.euclideanDistance(out, deathrow2)
      );
      // console.log("  eeeee  e   e " + curr_distance2);
      if (curr_distance2 > distance) {
        results["selection"] = key;
        results["text"] = value["Last Statement"];
        distance = curr_distance2;
        // data_inmates_2[key]

        setdistanceScore(distance);
        setlastwords(results.text);
      }
    }

    setTimeout(() => onPlay(), 3000);
  };

  const style = {
    h1: {
      marginTop: "1em",
      color: "#fff",
    },
    h2: {
      margin: "4em 0em 2em",
      color: "#169A58",
    },
    h3: {
      marginTop: "1em",
      padding: "0.5em 0em",
      color: "#252626",
      marginBottom: "10px",
    },
    h4: {
      marginTop: "1em",
      padding: "0.5em 0em",
      color: "#4A4A4A",
      marginBottom: "10px",
    },
    last: {
      marginBottom: "30px",
    },
    banner: {
      margin: "4em 0em 2em",
      backgroundColor: "#252839",
      display: "flex",
      flexDirection: "column",
    },
  };

  return (
    <>
      <div>
        <Container fluid>
          <Container fluid style={style.banner}>
            <Header as="h2" style={style.banner} inverted textAlign="center">
              Last Words
            </Header>
          </Container>
          <Divider />
          <Container>
            <Grid columns={2} stackable>
              <Grid.Row>
                <Grid.Column>
                  <Header
                    as="h3"
                    textAlign="center"
                    content="Last statement from best match:"
                  />
                  <Header.Subheader textAlign="justified" content={lastwords} />
                </Grid.Column>
                <Grid.Column>
                  <Container>
                    <video
                      ref={video}
                      autoPlay
                      muted
                      onPlay={onPlay}
                      style={{
                        width: "720",
                        height: "560",
                        left: 0,
                        right: 0,
                        bottom: 0,
                        top: 0,
                        alignSelf: "center",
                        display: "flex",
                      }}
                    />
                  </Container>
                  <canvas
                    id="overlay"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                    }}
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>

            <Grid columns={2} stackable>
              <Grid.Column>
                <Container textAlign="justified">
                  <Header>How it works</Header>
                  <Header.Subheader>
                    Let the webcam detect your face. Then, an algorithm matches
                    your face to more than a hundred inmates sentenced to death.
                    After the loop, you can see the last words pronounced by the
                    matched inmate before death.
                  </Header.Subheader>
                  <Divider></Divider>
                  <Header>
                    Please share you feedback by partecipating to a survey.
                  </Header>
                  <Button
                    color="blue"
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href =
                        "https://nottingham.onlinesurveys.ac.uk/last-words-survey";
                    }}
                  >
                    Go to Survey
                  </Button>
                </Container>
              </Grid.Column>
              <Grid.Column>
                <Container textAlign="justified">
                  <Header>About</Header>
                  <Header.Subheader>
                    The Texas Department of Criminal Justice has made available
                    a database that includes the last words of offenders before
                    execution. In addition, this dataset contains personal
                    photos and information on criminals executed by the Texas
                    Department of Criminal Justice from 1982 through November 8,
                    2017. Texas adopted lethal injection execution in 1977 and
                    1982, the year in which this dataset, the first offender was
                    executed by this method. Capital punishment is one of the
                    controversial issues on human rights in the United States.
                    This artistic project aims to propose a reflection on
                    Capital punishment using artificial intelligence as a
                    stimulus. First, a computer vision algorithm detects the
                    user's face through the webcam. Next, another algorithm
                    calculates the similarity of the user's face with the look
                    of one of the death row inmates present in the database.
                    Finally, a third algorithm then presents the user with the
                    last words spoken of the selected condemned. This artistic
                    project is part of my PhD at the University of Nottingham
                    which aims to explore the use of artificial intelligence to
                    produce works of art.
                  </Header.Subheader>
                </Container>
              </Grid.Column>
            </Grid>
          </Container>
        </Container>
        <Divider />

        <Container>
          <Header as="h2" textAlign="center">
            <Header.Subheader>An artwork by guidosalimbeni.it</Header.Subheader>
          </Header>
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

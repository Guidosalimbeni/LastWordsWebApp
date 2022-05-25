import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import * as faceapi from "face-api.js";
// import data_inmates from "./data";
import data_inmates_2 from "./data2";
import data_info from "./info";
import "./styles.css";
import ReactGA from "react-ga";
import "semantic-ui-css/semantic.min.css";
import {
  Container,
  Form,
  Header,
  Input,
  Grid,
  Divider,
  Button,
  Image,
} from "semantic-ui-react";
import { round } from "face-api.js";

var video = React.createRef();
var mediaStream = React.createRef();

function App() {
  const [lastwords, setlastwords] = useState("");
  const [extrainfo, setExtrainfo] = useState("");
  var [distance, setdistanceScore] = useState(1);
  const [userInput, setUserInput] = useState("");
  const timetowait = 2000;

  useEffect(() => run(), []);
  const log = (...args) => {
    console.log(...args);
  };

  useEffect(() => {
    ReactGA.initialize("UA-199875361-1");
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  const changePromptHandler = (e) => {
    e.preventDefault();
    setUserInput(e.target.value);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    let feedback = userInput;
    let form = new FormData();
    form.append("feedback", feedback);

    fetch("https://www.guidosalimbeni.it/aironic/addfeedback.php", {
      // URL
      // body: JSON.stringify(form), // data you send.
      body: new URLSearchParams(form),

      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      headers: {
        "content-type": "application/json",
      },
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "no-cors", // no-cors, cors, *same-origin
      redirect: "follow", // *manual, follow, error
      referrer: "no-referrer", // *client, no-referrer
    })
      .then((resp) => {
        console.log(resp);
      })
      .then((err) => console.log(err));
  };

  const run = async () => {
    log("run started");
    try {
      await faceapi.nets.tinyFaceDetector.load("/models/");
      await faceapi.nets.ssdMobilenetv1.load("/models");
      await faceapi.loadFaceExpressionModel(`/models/`);
      await faceapi.loadFaceRecognitionModel(`/models/`);
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
      setTimeout(() => onPlay(), timetowait);
      return;
    }

    var out = await faceapi.computeFaceDescriptor(video.current);
    var result = await faceapi.detectSingleFace(video.current);

    if (result) {
      const canvas = document.getElementById("overlay");

      var w = result.imageWidth;
      var h = result.imageHeight;

      const dims = faceapi.resizeResults(result, {
        width: w,
        height: h,
      });

      canvas.width = w;
      canvas.height = h;

      faceapi.drawDetection(canvas, dims, false);

      // const dims = faceapi.matchDimensions(canvas, video.current, true);
      // faceapi.drawDetection(canvas, faceapi.resizeResults(result, dims));
      // https://www.youtube.com/watch?v=CVClHLwv-4I
    }

    // var i;
    var results = { selection: 1, text: "none" };
    // var distance = 1.0;

    // USING AIRONIC DATABASE SINCE DID NOT WANT TO CREATE A NEW DATABASE ??????????????????!!!!!!!!!!!

    for (const [key, value] of Object.entries(data_inmates_2)) {
      // console.log(key, value);
      const image = await faceapi.fetchImage("/images2/" + key + ".jpg");
      var deathrow2 = await faceapi.computeFaceDescriptor(image);
      let curr_distance2 = faceapi.round(
        faceapi.euclideanDistance(out, deathrow2)
      );

      if (curr_distance2 < distance) {
        // console.log("  eeeee  e   e " + curr_distance2);
        results["selection"] = key;
        results["text"] = value["Last Statement"];
        distance = curr_distance2;
        distance = distance - 0.1;
        // data_inmates_2[key]
        if (typeof data_info[key]["offender_info"] !== "undefined") {
          setExtrainfo(data_info[key]["offender_info"]);
          // console.log(data_info[key]["offender_info"]);
        }
        //

        setdistanceScore(distance);
        setlastwords(results.text);
      }
    }

    setTimeout(() => onPlay(), timetowait);
  };

  const style = {
    banner: {
      margin: "4em 0em 2em",
      backgroundColor: "#252839",
      display: "flex",
      flexDirection: "column",
    },
  };

  const logo1 = "/images/ukri.png";
  const logo2 = "/images/uon.jpeg";

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
                  <Divider></Divider>
                  <Header.Subheader
                    textAlign="justified"
                    content={
                      "Your face matches: " +
                      round((1 - distance) * 100) +
                      "% the inmate's face. See the original photo and read more information about the offender at this link: "
                    }
                  />
                  <a href={extrainfo} target="_blank" rel="noopener noreferrer">
                    Lint to the Offender Information from the Texas Department
                    of Criminal Justice
                  </a>
                </Grid.Column>
                <Grid.Column>
                  <Container>
                    <video
                      ref={video}
                      autoPlay
                      muted
                      onPlay={onPlay}
                      style={{
                        width: 376,
                        height: 282,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        top: 0,

                        // position: "relative",
                      }}
                    />
                  </Container>
                  <canvas
                    id="overlay"
                    style={{
                      width: 376,
                      height: 282,
                      position: "absolute",

                      left: 0,
                      right: 0,
                      bottom: 0,
                      top: 0,
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
                    The face similarity is given features extracted by the
                    artificial neural network. Wait a couple of seconds as the
                    machine loops over all the possible matches. If you want to
                    try again you might need to refresh the page.
                  </Header.Subheader>
                  <Divider></Divider>
                  <Header>Please provide your feedback</Header>
                  <Container>
                    <Form>
                      <Form.Group widths="equal">
                        <Form.Field
                          control={Input}
                          onChange={changePromptHandler}
                          label="How would you improve this art project?"
                          placeholder="Please type your feedbackk here"
                        />
                      </Form.Group>

                      <Form.Field
                        name="data"
                        color="blue"
                        onClick={(e) => submitHandler(e)}
                        control={Button}
                      >
                        Submit
                      </Form.Field>
                    </Form>
                  </Container>
                  <Divider></Divider>
                  <Header>
                    Please share you feedback by partecipating to a survey.
                  </Header>
                  <Button
                    color="blue"
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href =
                        "https://nottingham.onlinesurveys.ac.uk/art-project-last-words-survey-art-by-guido-salimbeni";
                    }}
                  >
                    Go to Survey
                  </Button>
                  <Divider></Divider>
                  <Image.Group size="small">
                    <Image src={logo1} />
                    <Image src={logo2} />
                  </Image.Group>
                  <Divider></Divider>
                  <Header.Subheader>
                    First, a computer vision algorithm detects the user's face
                    through the webcam. Next, another algorithm calculates the
                    similarity of the user's face with the look of one of the
                    death row inmates present in the database. Finally, a third
                    algorithm then presents the user with the last words spoken
                    of the selected condemned. This artistic project is part of
                    my PhD at the University of Nottingham which aims to explore
                    the use of artificial intelligence to produce works of art.
                    It is difficult to get an 100% match, however the algorithm
                    can give a score for the best match.
                  </Header.Subheader>
                </Container>
              </Grid.Column>
              <Grid.Column>
                <Container textAlign="justified">
                  <Header>About</Header>
                  <Header.Subheader>
                    I have often heard phrases like, your daughter looks a lot
                    like you, you look like a stark copy of your brother, or
                    maybe your face reminds me of someone. Have we met before?
                    Sometimes, I'm surprised by how complicated it is for
                    someone to recognise a person by their face. For instance,
                    my wife doesn't recognise me at the bar (true story). You
                    remind me of someone, another question that often remains
                    unsolved and frustrating. And then comes the artificial
                    intelligence, and for the machine, recognising a face seems
                    like a walk in the park. For a human, recognising a face
                    comes with a feeling of gratification. There is a sense of
                    empathy or curiosity for the person we look like when we are
                    recognised. I thought if the machine could help us find
                    these similarities, how can I translate it all into an
                    artistic experience? The reason is that I am an artist, and
                    I like to experiment with artificial intelligence and art.
                    Then I asked myself what would be difficult to feel empathy
                    for and thought of the Texas database of death row inmates.
                    In response, I develop this application, hoping to arouse
                    curiosity and perhaps provoke reasoning both on technology
                    and on a complex issue such as the death penalty.
                  </Header.Subheader>
                  <Divider></Divider>
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
                    Capital punishment, using artificial intelligence as a
                    stimulus of empathic emotions.
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

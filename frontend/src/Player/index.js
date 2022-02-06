import React, { useState, useRef } from "react";
import ReactPlayer from "react-player";
import { Accordion, Card, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
const data = require("./dummy2.json");

function Player({ videoPath }) {
  const player = useRef();
  const handleClick = (event) => {
    console.log(event.target.innerText);
    let seekTimeArr = event.target.innerText.split(":");
    let seekTime = Number(seekTimeArr[0] * 60) + Number(seekTimeArr[1]);
    player.current.seekTo(seekTime);
  };
  function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  }

  return (
    <div>
      <ReactPlayer
        ref={player}
        url={"https://www.youtube.com/watch?v=h7apO7q16V0"}
        width="100%"
        height="100%"
        controls={true}
      />
      <Accordion defaultActiveKey="1" flush>
        <Accordion.Item eventKey="0">
          <Accordion.Header><h1>Video Transcript</h1></Accordion.Header>
          <Accordion.Body>
            <p>{data.text}</p>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      <h1>Timestamps</h1>
      <div>
        {data.chapters.map((chapter) => {
          return (
            <div>
              <div>
                {" "}
                <b>Gist: </b> {chapter.gist}{" "}
              </div>
              <div>
                {" "}
                <b>Timestamp: </b>{" "}
                <button onClick={handleClick}>
                  {millisToMinutesAndSeconds(chapter.start)}{" "}
                </button>{" "}
                --{" "}
                <button onClick={handleClick}>
                  {millisToMinutesAndSeconds(chapter.end)}
                </button>{" "}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default Player;

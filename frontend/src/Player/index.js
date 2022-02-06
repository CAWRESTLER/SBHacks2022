import React, { useState, useRef } from "react";
import ReactPlayer from "react-player";
import { Accordion, Card, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
const data = require("./dummy2.json");


// words {"text": "This", "start": 910, "end": 1074, "confidence": 0.99275, "speaker": null}
// appends two "words"
export function concatWords(word1, word2) {
  return ({
    "text": word1.text + " " + word2.text,
    "start": word1.start,
    "end": word2.end
  })
}

export function makeSentences(words, len, accum) {
  if(words.length === 0 ||  !Array.isArray(words)) return accum

  const l = words.slice(0,len)
  const r = words.slice(len, words.length)
  // console.log(r)
  console.log(l)
  const g = l.reduce((prev, next) => concatWords(prev,next))
// not sure if js optimizes tail recursion.. haha
  return makeSentences(r, len, accum.concat(g))


}

function Player ({ videoPath,
                   data
                 })  {
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
        url={videoPath}
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
      <h1>Captions</h1>
      <div>
        {makeSentences(data.words,20,[]).map((chapter) => {
          return (
            <div>
              <div>
                {" "}
                <b>Gist: </b> {chapter.text}{" "}
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

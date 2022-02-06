import React, { useState } from "react"
import ReactPlayer from 'react-player';
const data = require("./dummy2.json")


function Chapter ({ chapter }) {
  function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }
  const handleClick = (event) => {
    console.log(event.target.innerText)
  }
  console.log(chapter)
  return (
    <div>
        <div> <b>Gist: </b> {chapter.gist} </div>
      <div> <b>Timestamp: </b> <button onClick={handleClick}>{millisToMinutesAndSeconds(chapter.start)} </button> -- <button onClick={handleClick}>{millisToMinutesAndSeconds(chapter.end)}</button> </div>
    </div>
  )
}

function Player ({ videoPath })  {

  return (
    <div>
        <ReactPlayer  url={"https://www.youtube.com/watch?v=h7apO7q16V0"} width="100%" height="100%" controls={true} />
    <h1>Video transcript:  </h1>
      <p>
        {data.text}
      </p>
      <h1>Timestamps</h1>
      <div>
        {
          data.chapters.map(chapter => <Chapter chapter={chapter}/> )
        }
      </div>

    </div>
  )
}
export default Player

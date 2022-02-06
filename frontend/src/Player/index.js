import React, { useState } from "react"
import ReactPlayer from 'react-player';
const data = require("./dummy.json")

function Chapter ({ chapter }) {
  console.log(chapter)
  return (
    <div>
        <div> <b>Gist: </b> {chapter.gist} </div>
      <div> <b>Timestamp: </b> {chapter.start} -- {chapter.end} </div>
    </div>
  )
}

function Player ({ videoPath })  {

  return (
    <div>
        <ReactPlayer url={"https://www.youtube.com/watch?v=h7apO7q16V0"} width="100%" height="100%" controls={true} />
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

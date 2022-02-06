import React, { useMemo } from 'react';
import axios from 'axios';
import Player from "./Player"
import { useDropzone } from 'react-dropzone';
import './App.css'
// import axios from 'axios';
const baseStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: '40px',
  borderColor: '#DCDCDC',
  borderStyle: 'solid',

  color: '#bdbdbd',
  transition: 'border .3s ease-in-out',
};

const activeStyle = {
  borderColor: '#2196f3'
};

const acceptStyle = {
  borderColor: '#00e676'
};

const rejectStyle = {
  borderColor: '#ff1744'
};

const App = () => {
  // a local state to store the currently selected file.
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [apikey, setApikey] = React.useState(null);
  const [videoFilePath, setVideoFilePath] = React.useState(null);
  const [data, setData] = React.useState(null);
  const [videoUrl, setVideoUrl] = React.useState(null);
  // Video StatesFilePath
  // waitingFile - uploading - showvideo
  const [appState, setAppState] = React.useState("waitingFile");


  // const handleVideoUpload = (event) => {
  //   setVideoFilePath(URL.createObjectURL(event.target.files[0]));
  // };

  const url = (process.env.NODE_ENV !== 'production') ? "http://localhost:5000/" : ""
  const handleSubmit = async (event) => {
    event.preventDefault()
    const formData = new FormData();
    const formData2 = new FormData();
    formData.append("file", selectedFile);
    formData.append("apikey", apikey);
    setAppState("uploading")
    console.log("sending form data")
    // console.log(formData.values())
    // Display the values
    for (var value of formData.values()) {
      console.log(value);
    }
    // the url is run in localhost when in development..
    try {
      // upload the file
      const response = await axios({
        method: "post",
        url: url + "/api/upload",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      // Wait 3 seconds to mock the uploading process
      await new Promise(r => setTimeout(r, 3000));

      // response.data will contain
      // { filepath: "url" , query_id: "url" }
      setVideoUrl(response.data.filepath)
      // Make a get requst to check the id
      const data = await axios.get(url + '/api/assembly/check_id', {
        params: {
          apikey: apikey,
          id: response.data.query_id
        }
      })
      let status = data.data.status
      while (status != "completed") {
        console.log(status)
        await new Promise(r => setTimeout(r, 3000));
        const d = await axios.get(url + '/api/assembly/get_id_status', {
          params: {
            apikey: apikey,
            id: response.data.query_id
          }
        })
        status = d.data
        console.log(status)
      }
      // make another request to get the data once completed
      const dcomp = await axios.get(url + '/api/assembly/check_id', {
        params: {
          apikey: apikey,
          id: response.data.query_id
        }
      })
      setData(dcomp.data);
      console.log(dcomp.data)
      setAppState("showVideo")
    } catch (error) {
      console.log(error)
    }
  }

  // const handleFileSelect = (event) => {
  //   console.log("handle file")
  //   setSelectedFile(event.target.files[0])
  //   // setVideoFilePath(URL.createObjectURL(event.target.files[0]));
  // }
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    acceptedFiles
  } = useDropzone({
    onDrop: (acceptedFiles) => {
      setSelectedFile(acceptedFiles[0])
      setVideoFilePath(URL.createObjectURL(acceptedFiles[0]));
    },
    accept: 'video/mp4, audio/mp3'
  });

  const style = useMemo(() => ({
    ...baseStyle,
    ...(isDragActive ? activeStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [
    isDragActive,
    isDragReject,
    isDragAccept
  ]);

  const files = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  switch (appState) {
    case "waitingFile":
      // If I abstract into a component clicking doesn't work for some reason
      return (<body>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
        <form onSubmit={handleSubmit}>

          {/* <input type="file" onChange={handleFileSelect}/> */}
          <div {...getRootProps({ style })} className="contain">
            <input {...getInputProps()} />
            <div class="icon"><i class="fas fa-cloud-upload-alt"></i></div>
            <header>Drag and drop your videos here.</header>
            <span>or upload the files</span>

          </div>
          <div >
            <h4>UPLOADED FILE</h4>
            <ul class="gradient-list">
              <li>  {files} </li>
            </ul>
          </div>

          <h4>API KEY</h4>
          <input type="text" placeholder='ENTER THE API KEY' className='api' onChange={(e) => setApikey(e.target.value)} value={apikey} />
          <br></br>
          <br></br>
          <input type="submit" value="Submit" className='up' />
          {/* <ReactPlayer url={videoFilePath} width="100%" height="100%" controls={true} /> */}
        </form>
      </body>)
    case "uploading":
      return (<div className='upload'> <span>U</span>
        <span>P</span>
        <span>L</span>
        <span>O</span>
        <span>A</span>
        <span>D</span>
        <span>I</span>
        <span>N</span>
        <span>G</span>
      </div>)
    case "showVideo":
      // Right now the video is played from the server..
      // but we can also play the local version too. Probs better
      // (<ReactPlayer url={videoFilePath} width="100%" height="100%" controls={true} />)
      return <Player videoPath={videoFilePath} data={data} />
    // return (<ReactPlayer url={url + videoUrl} width="100%" height="100%" controls={true} />)

    default:
      return (<div class="text"><span>Ooops...</span><br></br>Something went wrong</div>)
  }
};



export default App;

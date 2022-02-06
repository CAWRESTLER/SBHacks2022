import React, { useMemo } from 'react';
import axios from 'axios';
import Player from "./Player"
import { useDropzone } from 'react-dropzone';
// import axios from 'axios';
const baseStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
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
  const [appState, setAppState] = React.useState("showVideo");


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
      // await new Promise(r => setTimeout(r, 3000));

      // response.data will contain
      // { filepath: "url" , query_id: "url" }
      setVideoUrl(response.data.filepath)
      // Make a get requst to check the id
      const data = await axios.get(url +  '/api/assembly/check_id', {
        params: {
          apikey: apikey,
          id: response.data.query_id
        }
      })
      let status = data.data.status
      while(status != "completed"){
        console.log(status)
        await new Promise(r => setTimeout(r, 3000));
        const d = await axios.get(url +  '/api/assembly/get_id_status', {
        params: {
          apikey: apikey,
          id: response.data.query_id
        }
        })
        status = d.data
        console.log(status)
      }
      // make another request to get the data once completed
      const dcomp = await axios.get(url +  '/api/assembly/check_id', {
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
      return (<form onSubmit={handleSubmit}>
        {/* <input type="file" onChange={handleFileSelect}/> */}
        <div {...getRootProps({ style })}>
          <input {...getInputProps()} />
          <div>Drag and drop your videos here.</div>
        </div>
        <aside>
          <h4>Files to upload</h4>
          <ul>{files}</ul>
        </aside>
        <input type="text" name="apikey" onChange={(e) => setApikey(e.target.value)} value={apikey} />
        <input type="submit" name="apikey" value="Upload File" />
      </form>)
    case "uploading":
      return (<div> uploadng </div>)
    case "showVideo":
      // Right now the video is played from the server..
      // but we can also play the local version too. Probs better
      // (<ReactPlayer url={videoFilePath} width="100%" height="100%" controls={true} />)
      return <Player videoPath={videoFilePath} data={data} />
    // return (<ReactPlayer url={url + videoUrl} width="100%" height="100%" controls={true} />)

    default:
      return (<div>Something went wrong</div>)
  }
};



export default App;

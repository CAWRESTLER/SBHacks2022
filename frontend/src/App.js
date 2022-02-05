import React, { useMemo } from 'react';
import axios from 'axios';
import ReactPlayer from 'react-player';
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
  const [videoFilePath, setVideoFilePath] = React.useState(null);


  const handleVideoUpload = (event) => {
    setVideoFilePath(URL.createObjectURL(event.target.files[0]));
  };

  const handleSubmit = async (event) => {
    event.preventDefault()
    const formData = new FormData();
    formData.append("file", selectedFile);
    console.log("sending form data")
    // the url is run in localhost when in development..
    const url = (process.env.NODE_ENV !== 'production') ? "http://localhost:5000/" : ""
    try {
      const response = await axios({
        method: "post",
        url: url + "/api/upload",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      // response.data will contain
      // { filepath: "url" , query_id: "url" }
      console.log(response)
    } catch (error) {
      console.log(error)
    }
  }

  const handleFileSelect = (event) => {
    console.log("handle file")
    setSelectedFile(event.target.files[0])
    setVideoFilePath(URL.createObjectURL(event.target.files[0]));
  }
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

  return (
    <form onSubmit={handleSubmit}>
      {/* <input type="file" onChange={handleFileSelect}/> */}
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <div>Drag and drop your videos here.</div>
      </div>
      <aside>
        <h4>Files to upload</h4>
        <ul>{files}</ul>
      </aside>
      <input type="submit" value="Upload File" />
      {/* <ReactPlayer url={videoFilePath} width="100%" height="100%" controls={true} /> */}
    </form>
  )
};



export default App;

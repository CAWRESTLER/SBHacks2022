// import React, { useCallback, useMemo,useState } from 'react';
// import { useDropzone } from 'react-dropzone';
// import axios from 'axios';
// const baseStyle = {
//   display: 'flex',
//   flexDirection: 'column',
//   alignItems: 'center',
//   padding: '20px',
//   borderWidth: 2,
//   borderRadius: 2,
//   borderColor: '#eeeeee',
//   borderStyle: 'dashed',
//   backgroundColor: '#fafafa',
//   color: '#bdbdbd',
//   transition: 'border .3s ease-in-out',
// };

// const activeStyle = {
//   borderColor: '#2196f3'
// };

// const acceptStyle = {
//   borderColor: '#00e676'
// };

// const rejectStyle = {
//   borderColor: '#ff1744'
// };

// function App(props) {
//   const [url, setUrl] =useState();

//   const onDrop = useCallback(acceptedFiles => {
//     setUrl(acceptedFiles[0].path);

//   }, []);
//   const handleChange = () =>{
//     var bodyFormData = new FormData();
//     bodyFormData.append('file', url)
//     axios({
//       method: "post",
//       url: "http://localhost:5000/api/upload",
//       data: bodyFormData,
//       headers: { "Content-Type": "multipart/form-data" },
//     })
//       .then(function (response) {
//         //handle success
//         console.log(response);
//       })
//       .catch(function (response) {
//         //handle error
//         console.log(response);
//       });
//     }

//   const {
//     getRootProps,
//     getInputProps,
//     isDragActive,
//     isDragAccept,
//     isDragReject
//   } = useDropzone({
//     onDrop,
//     accept: 'video/mp4, audio/mp3'
//   });

//   const style = useMemo(() => ({
//     ...baseStyle,
//     ...(isDragActive ? activeStyle : {}),
//     ...(isDragAccept ? acceptStyle : {}),
//     ...(isDragReject ? rejectStyle : {})
//   }), [
//     isDragActive,
//     isDragReject,
//     isDragAccept
//   ]);

//   return (
//     <>
//         <h1> Study Helper</h1>

//     <div {...getRootProps({style})}>
//       <input {...getInputProps()} />
//       <div>Drag and drop your videos here.</div>
//     </div>
//     <button onClick={handleChange}>Upload</button>
//     </>
//   )
// }

// export default App;

import React from 'react';
import axios from 'axios';
import ReactPlayer from 'react-player';

const App = () => {
  // a local state to store the currently selected file.
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [videoFilePath, setVideoFilePath] = React.useState(null);


const handleVideoUpload = (event) => {
setVideoFilePath(URL.createObjectURL(event.target.files[0]));
};

  const handleSubmit = async(event) => {
    event.preventDefault()
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      const response = await axios({
        method: "post",
        url: "http://localhost:5000/api/upload",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch(error) {
      console.log(error)
    }
  }

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0])
    setVideoFilePath(URL.createObjectURL(event.target.files[0]));
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleFileSelect}/>
      <input type="submit" value="Upload File" />
      <ReactPlayer url = { videoFilePath }  width="100%" height="100%" controls={true} />
"
    </form>
  )
};

export default App;
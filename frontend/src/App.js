import React, { useCallback, useMemo,useState } from 'react';
import { useDropzone } from 'react-dropzone';
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

function App(props) {
  const [url, setUrl] =useState();

  const onDrop = useCallback(acceptedFiles => {
    setUrl(acceptedFiles[0].path);

  }, []);
  const handleChange = () =>{
    var requestOptions = {
      method: 'POST',
      redirect: 'follow'
    };
    
    fetch(`localhost:5000/api/upload?file=${url}`, requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  }

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({
    onDrop,
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

  return (
    <>
        <h1> Study Helper</h1>

    <div {...getRootProps({style})}>
      <input {...getInputProps()} />
      <div>Drag and drop your videos here.</div>
    </div>
    </>
  )
}

export default App;
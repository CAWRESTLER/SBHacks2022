import React, { useCallback, useMemo } from 'react';
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
  const onDrop = useCallback(acceptedFiles => {
    console.log(acceptedFiles);
  }, []);

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
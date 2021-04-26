import React, { Fragment, useState } from 'react';
import Message from './Message';
import Progress from './Progress';
import axios from 'axios';

const FileUpload = (props) => {
    const [file, setFile] = useState('');
    const [filename, setFilename] = useState('Choose File');
    const [uploadedFile, setUploadedFile] = useState(false);
    const [message, setMessage] = useState('');
    const [uploadPercentage, setUploadPercentage] = useState(0);

    const onChange = e => {
        if (e.target.files[0] !== undefined) {
            console.log(e.target.files[0]);
            setFile(e.target.files[0]);
            setFilename(e.target.files[0].name);
        }
    };

  const onSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('uploaded_file', file);

    try {
        const res = await axios.post(`http://${process.env.REACT_APP_BACKEND_URL}/text-from-image`, formData, {
            headers: {
                Authorization: `Bearer ${props.token}`,
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: progressEvent => {
                setUploadPercentage(parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total)));
                setTimeout(() => setUploadPercentage(0), 10000);
            }
        });
        console.log(res.data);
        // const { fileName, filePath } = res.data;
        // setUploadedFile({ fileName, filePath });
        setUploadedFile(true);
        setMessage('File Uploaded');
    } catch (err) {
        if (err.response.status === 500) {
            setMessage('There was a problem with the server');
        } else {
            setMessage(err.response.data.msg);
        }
    }
  };

  return (
    <Fragment>
      {message ? <Message msg={message} /> : null}
      <form onSubmit={onSubmit}>
        <div className='custom-file mb-4'>
          <input
            type='file'
            className='custom-file-input'
            id='customFile'
            onChange={onChange}
          />
          <label className='custom-file-label' htmlFor='customFile'>
            {filename}
          </label>
        </div>

        <Progress percentage={uploadPercentage} />

        <input
          type='submit'
          value='Upload'
          className='btn btn-primary btn-block mt-4'
        />
      </form>
      {uploadedFile ? (
        <div className='row mt-5'>
          <div className='col-md-6 m-auto'>
            <img style={{ width: '100%' }} src={URL.createObjectURL(file)} alt='' />
          </div>
        </div>
      ) : null}
    </Fragment>
  );
};

export default FileUpload;
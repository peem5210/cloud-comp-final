import React, { Fragment, useState, useContext } from 'react';
import axios from 'axios';
import Select from 'react-select';
import Message from './Message';
import Progress from './Progress';
import { ShippingOptions } from './ShippingOptions';
import { DataContext } from './DataContext';
import './FileUpload.css';

const FileUpload = (props) => {
    const [file, setFile] = useState('');
    const [filename, setFilename] = useState('Choose File');
    const [message, setMessage] = useState('');
    const [uploadPercentage, setUploadPercentage] = useState(0);
    const [provider, setProvider] = useState('');
    const data = useContext(DataContext);

    const onChange = e => {
        if (e.target.files[0] !== undefined) {
            setFile(e.target.files[0]);
            setFilename(e.target.files[0].name);
        }
    };

  const onSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('uploaded_file', file);

    if (file === '') {
      setMessage('Please Select Image');
    } else if (provider === '') {
      setMessage('Please Select Provider');
    } else {
      try {
          const res = await axios.post(`https://${process.env.REACT_APP_BACKEND_URL}/text-from-image/${provider}`, formData, {
              headers: {
                  Authorization: `Bearer ${props.token}`,
                  'Access-Control-Allow-Origin': '*',
                  'Content-Type': 'multipart/form-data',
              },
              onUploadProgress: progressEvent => {
                  setUploadPercentage(parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total)));
                  setTimeout(() => setUploadPercentage(0), 20000);
              }
          });
          data.setParcelList(res.data.words);
          data.setS3Url(res.data.image_url);
          data.setUploadedFile(true);
          setMessage('File Uploaded');
      } catch (err) {
          if (err.response.status === 500) {
              setMessage('There was a problem with the server');
          } else {
              setMessage(err.response.data.msg);
          }
      }
    }
  };

  const onSelectProvider = (selectedItem) => {
    if (selectedItem !== null) {
        setProvider(selectedItem.value);
    } else {
        setProvider('');
    }
  };

  return (
    <Fragment>
      {message ? <Message msg={message} /> : null}
      <div className='selector'>
          <Select
              className="basic-single"
              classNamePrefix="select"
              isClearable={true}
              isSearchable={true}
              options={ShippingOptions}
              placeholder="Select Shipping Provider"
              isMulti={false}
              onChange={onSelectProvider}
          />
      </div>
      <br></br>
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
      <br></br>
    </Fragment>
  );
};

export default FileUpload;
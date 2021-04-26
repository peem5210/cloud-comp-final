import React, { createContext, useState } from "react";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [token, setToken] = useState('');
    const [s3Url, setS3Url] = useState('');
    const [uploadedFile, setUploadedFile] = useState('');
    const [parcelList, setParcelList] = useState([]);

    return (
        <DataContext.Provider
        value={{
            token,
            parcelList,
            s3Url, 
            uploadedFile, 
            setUploadedFile,
            setS3Url,
            setToken,
            setParcelList,
        }}
        >
        {children}
        </DataContext.Provider>
    );
};
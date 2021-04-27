import React, { createContext, useState } from "react";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [s3Url, setS3Url] = useState('');
    const [uploadedFile, setUploadedFile] = useState('');
    const [parcelList, setParcelList] = useState([]);

    return (
        <DataContext.Provider
        value={{
            parcelList,
            s3Url, 
            uploadedFile, 
            setUploadedFile,
            setS3Url,
            setParcelList,
        }}
        >
        {children}
        </DataContext.Provider>
    );
};
import React, { createContext, useState } from "react";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [token, setToken] = useState('');
    const [parcelList, setParcelList] = useState([]);

    return (
        <DataContext.Provider
        value={{
            token,
            parcelList,
            setToken,
            setParcelList,
        }}
        >
        {children}
        </DataContext.Provider>
    );
};
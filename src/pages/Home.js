import React from "react";
import NavigationBar from "../components/Header";
import Header from "../components/NavigationBar";
import Statistical from "../components/Statistical";
import {TabTitle} from "../utils/DynamicTitle";

const Home = () => {
    TabTitle('Trung Tâm Tin Học LP');

    return (
        <>
            <Header/>

            <NavigationBar/>

            <Statistical/>
        </>
    );
}

export default Home;
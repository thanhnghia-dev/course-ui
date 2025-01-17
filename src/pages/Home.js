import React from "react";
import NavigationBar from "../components/Header";
import Header from "../components/NavigationBar";
import Statistical from "../components/Statistical";

const Home = () => {
    return (
        <>
            <Header/>

            <NavigationBar/>

            <Statistical/>
        </>
    );
}

export default Home;
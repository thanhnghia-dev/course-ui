import React from "react";

const Footer = () => {
    const footerStyle = {
        backgroundColor: '#343957'
    };

    const footerContent = {
        textAlign: 'center',
        color: '#fff',
        lineHeight: '2'
    };

    return (
        <div className="footer-wrapper" style={footerStyle}>
            <div className="row">
                <div className="col-lg-12">
                    <div className="footer">
                        <p style={footerContent}>
                            <em>Fanpage: </em>
                            <a href="https://www.facebook.com/itluphung" style={{color: '#fff'}}>TIN HỌC LP</a>
                            <br/>
                            Copyright © 2025 Trung Tâm Tin Học LP
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Footer;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import './CertificateDownload.css';

const CertificateDownload = () => {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sucess, setSucess] = useState("")

    useEffect(() => {
        if (error) {
            setTimeout(() => {
                setError(null)
            }, 2000);
        }
        if (sucess) {
            setTimeout(() => {
                setSucess("")
            }, 2000);
        }
    }, [error, sucess])


    const handleDownload = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post('https://certificate-cdaab1fad2d2.herokuapp.com/certification/generate', { name });
            const imageUrl = response.data.link;
            const responseBlob = await axios.get(imageUrl, { responseType: 'blob' });
            saveAs(responseBlob.data, 'certificate.png');
            if (imageUrl) {
                setSucess("Your certificate has been successfully downloaded to your Downloads folder. Thanks!")
            }
        } catch (err) {
            setError("We couldn't find your record on our system. Failed to download certificate.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-box">
            <div className="container">
                <h1>Download Your Certificate</h1>
                <input
                    type="text"
                    placeholder="Enter your registration full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <div>
                    <button className='button' onClick={handleDownload} disabled={loading}>
                        {loading ? 'Downloading...' : 'Download'}
                    </button>
                </div>
                {sucess && <p className="success">{sucess}</p>}
                {error && <p className="error">{error}</p>}
            </div>
        </div>
    );
};

export default CertificateDownload;

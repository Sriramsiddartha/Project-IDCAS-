import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import './FileUpload.css';

const API_URL = 'http://127.0.0.1:8000';

function FileUpload({ onUpload, loading, setLoading }) {
  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log("Upload success:", response.data);
      onUpload(response.data);
    } catch (error) {
      console.error("Upload error details:", error);
      let errorMessage = 'Error uploading file: ';
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        errorMessage += `${error.response.status} ${error.response.statusText} - ${JSON.stringify(error.response.data)}`;
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage += 'No response received from server. Is the backend running?';
      } else {
        // Something happened in setting up the request that triggered an Error
        errorMessage += error.message;
      }
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [onUpload, setLoading]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

  return (
    <div className="file-upload-container">
      <div
        {...getRootProps()}
        className={`upload-area ${isDragActive ? 'dragging' : ''} ${loading ? 'loading' : ''}`}
      >
        <input {...getInputProps()} />
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Processing Dataset...</p>
          </div>
        ) : (
          <>
            <div className="upload-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="32" height="32"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
            </div>
            <div className="upload-text">
              <h3>{isDragActive ? 'Drop to Upload' : 'Import Dataset'}</h3>
              <p>Drag & drop your CSV or PDF file here</p>
            </div>
            <div className="file-types">
              <span className="type-badge">CSV</span>
              <span className="type-badge">PDF</span>
            </div>
          </>
        )}
      </div>
      {!loading && (
        <button className="btn upload-btn" onClick={getRootProps().onClick}>
          Browse Files
        </button>
      )}
    </div>
  );
}

export default FileUpload;


import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone'
import { useFileUpload } from '../hooks/useFileUpload';
import '../styles/FileUploadForm.scss';

interface FileUploadFormProps {
    onClose: () => void;
}

const FileUploadForm: React.FC<FileUploadFormProps> = ({ onClose }) => {
    const { fileContent, fileName, onDrop } = useFileUpload();
    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <div className="file-upload-form">
            <h2>Upload File</h2>
            {!fileContent ? (
                <div {...getRootProps({ className: 'dropzone' })}>
                    <input {...getInputProps()} />
                    <p>Drag 'n' drop some files here, or click to select files</p>
                </div>
            ) : (
                <div className="file-preview">
                    <h3>Preview: {fileName}</h3>
                    <pre>{fileContent}</pre>
                </div>
            )}
            <button onClick={onClose}>Close</button>
        </div>
    );
};

export default FileUploadForm;
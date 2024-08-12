import { useState } from "react";

export const useFileUpload = () => {
    const [fileContent, setFileContent] = useState<string | ArrayBuffer | null>(null);
    const [fileName, setFileName] = useState<string>('');

    const onDrop = (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        setFileName(file.name);
        const reader = new FileReader();
        reader.onload = (event) => {
            const fileText: string | ArrayBuffer | null | undefined = event.target?.result;
            setFileContent(fileText);
        };
        reader.readAsText(file);
    };

    return { fileContent, fileName, onDrop };
};
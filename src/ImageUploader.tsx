
import React, { useState } from 'react';
import axios from 'axios';
import imageType from 'image-type';

const allowedFormats = ['jpeg', 'png', 'webp'];

const ImageUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [detectedType, setDetectedType] = useState<string>('');
  const [targetFormat, setTargetFormat] = useState<string>('jpeg');
  const [convertedBlobUrl, setConvertedBlobUrl] = useState<string>('');
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("e : ", e);
    console.log("e.target : ", e.target);
    console.log("e.target.files : ", e.target.files);
    console.log("e.target.files[0] : ", e.target.files?.[0]);
    
    
    
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
 console.log("Preview URL: ", previewUrl);
 
    const buffer = await selectedFile.arrayBuffer();
    const type = await imageType(new Uint8Array(buffer));
    if (type) {
  // Extract "png" or "jpeg" from "image/png" or "image/jpeg"
  console.log("type : ",type);
  
  const extractedType = type.mime.split('/')[1];
  setDetectedType(extractedType);
}
  };

  const handleConvert = async () => {
    if (!file || !targetFormat) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('targetFormat', targetFormat);

    const response = await axios.post(
      'http://localhost:4000/api/convert',
      formData,
      { responseType: 'blob' }
    );

    const url = URL.createObjectURL(response.data);
    console.log("convertedBLoburl: ", url);
    
    setConvertedBlobUrl(url);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {previewUrl && (
        <>
          <img src={previewUrl} alt="Preview" className="mt-4 w-full rounded" />
          <p className="mt-2">Detected: {detectedType}</p>
          <select
            value={targetFormat}
            onChange={(e) => setTargetFormat(e.target.value)}
            className="mt-2 p-2 border"
          >
            {/* {allowedFormats.map((fmt) => (
              <option key={fmt} value={fmt}>{fmt}</option>
            ))} */}
            {
                allowedFormats.filter(fmt => fmt !== detectedType).map((fmt) => (
              <option key={fmt} value={fmt}>
                {fmt}
              </option>
            ))
            }
          </select>
          <button
            onClick={handleConvert}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Convert
          </button>
        </>
      )}
      {convertedBlobUrl && (
        <a
          href={convertedBlobUrl}
          download={`converted.${targetFormat}`}
          className="block mt-4 text-blue-700 underline"
        >
          Download Converted Image
        </a>
      )}
    </div>
  );
};

export default ImageUploader;

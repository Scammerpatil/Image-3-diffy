"use client";
import { IconClipboardText, IconCloudUpload } from "@tabler/icons-react";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

export default function GenerateImage() {
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState<any>(null);
  const generateImage = () => {
    if (!file) {
      toast.error("Please upload a file first.");
      return;
    }
    try {
      const res = axios.postForm("/api/generate-image", { file });
      toast.promise(res, {
        loading: "Generating image...",
        success: (data) => {
          setResponse(data.data);
          return "Image generated successfully!";
        },
        error: (error) => {
          console.error(error);
          return (
            error.response.data.message ||
            "Error generating image. Please try again."
          );
        },
      });
    } catch (error) {
      toast.error("Error generating image. Please try again.");
    }
  };
  return (
    <>
      <h1 className="text-4xl uppercase text-center font-bold">
        Generate Image From Sketch
      </h1>
      <div className="flex mt-6 items-center justify-center w-full max-w-md mx-auto hover:bg-base-300">
        <label
          className="flex flex-col items-center justify-center w-full h-full border-2 border-base-content border-dashed rounded-lg cursor-pointer bg-base-100 py-2"
          htmlFor="dropzone-file"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <IconCloudUpload size={48} className="text-base-content" />
            <p className="mb-2 text-sm text-base-content">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-base-content">
              PNG, JPEG, JPG, PDF (max. 10MB)
            </p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            accept="image/png, image/jpeg , image/jpg ,file/pdf"
            onChange={(e) => {
              setFile(e.target.files?.[0] || null);
            }}
          />
          {file && (
            <button className="btn btn-sm btn-info max-w-sm text-center">
              <IconClipboardText size={14} />
              {file?.name}
            </button>
          )}
        </label>
      </div>
      {file && (
        <div className="flex justify-center mt-6">
          <img
            src={URL.createObjectURL(file)}
            alt="Uploaded Preview"
            className="w-full max-w-md rounded-lg shadow-lg h-52 object-cover"
          />
        </div>
      )}
      <div className="flex justify-center mt-6">
        <button className="btn btn-primary" onClick={generateImage}>
          Generate Image
        </button>
      </div>
      {response && (
        <img
          src={response.imagePath}
          alt="Generated Image"
          className="w-full max-w-md rounded-lg shadow-lg mt-6 h-52 object-contain mx-auto"
        />
      )}
    </>
  );
}

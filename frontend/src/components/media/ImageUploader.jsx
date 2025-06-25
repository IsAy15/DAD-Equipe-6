"use client";
import { useState } from "react";

export default function ImageUploader() {
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState("");

  const handleChange = async (e) => {
    const image = e.target.files[0];

    const formData = new FormData();
    formData.append("file", image);

    setUploading(true);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setUrl(data.url);
    setUploading(false);
  };

  return (
    <div className="p-4">
      {url && (
        <div className="mt-4">
          <img src={url} alt="uploaded" className="w-48" />
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        className="input"
        onChange={handleChange}
      />
    </div>
  );
}

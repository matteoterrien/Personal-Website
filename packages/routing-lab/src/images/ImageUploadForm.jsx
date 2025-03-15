import React, { useState, useId, useActionState } from "react";

function readAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result);
    fr.onerror = (err) => reject(err);
    fr.readAsDataURL(file);
  });
}

export function ImageUploadForm({ authToken }) {
  const [previewSrc, setPreviewSrc] = useState(null);
  const fileInputId = useId();
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageTitle, setImageTitle] = useState("");

  const [result, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      const file = formData.get("image");
      const title = imageTitle.trim();

      if (!file || !title) {
        console.log("Missing file or title!");
        return {
          type: "error",
          message: "Please provide an image and a title.",
        };
      }

      try {
        const uploadData = new FormData();
        uploadData.append("image", file);
        uploadData.append("name", title);

        console.log(
          "Form Data:",
          uploadData.get("image"),
          uploadData.get("name")
        );
        console.log("Auth Token:", authToken);

        const response = await fetch("/api/images", {
          method: "POST",
          body: uploadData,
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          if (response.status === 400) {
            console.log("400 Bad Request - Check file format.");
            return {
              type: "error",
              message: "Bad upload request. Check file format.",
            };
          }
          if (response.status === 401) {
            console.log("401 Unauthorized - Missing or invalid token.");
            return {
              type: "error",
              message: "Unauthorized. Please log in again.",
            };
          }
          return { type: "error", message: "Upload failed. Please try again." };
        }

        return { type: "success", message: "Image uploaded successfully!" };
      } catch (error) {
        return { type: "error", message: "Network error. Please try again." };
      }
    }
  );

  async function handleFileChange(event) {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      try {
        const dataURL = await readAsDataURL(file);
        setPreviewSrc(dataURL);
      } catch (error) {
        console.error("Error reading file:", error);
      }
    }
  }

  return (
    <form action={submitAction}>
      <div>
        <label htmlFor={fileInputId}>Choose image to upload: </label>
        <input
          id={fileInputId}
          name="image"
          type="file"
          accept=".png,.jpg,.jpeg"
          onChange={(e) => {
            setImageTitle(e.target.value);
          }}
          disabled={isPending}
        />
      </div>

      <div>
        <label>
          <span>Image title: </span>
          <input
            name="name"
            value={imageTitle}
            onChange={(e) => setImageTitle(e.target.value)}
            disabled={isPending}
          />
        </label>
      </div>

      <div>
        {previewSrc && (
          <img style={{ maxWidth: "20em" }} src={previewSrc} alt="Preview" />
        )}
      </div>

      <button type="submit" disabled={isPending}>
        Confirm upload
      </button>

      {result && <p className={`message ${result.type}`}>{result.message}</p>}
    </form>
  );
}

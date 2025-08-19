"use client";

import { useState } from "react";
import { SelectMenu } from "@/app/components/selectmenu";
import { PhotoIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { saveAs } from "file-saver";
import { FileRejection } from "react-dropzone";
import { Field, Label, Description, Textarea } from "@headlessui/react";
import clsx from "clsx";

import { useSupabaseAuth } from "@/lib/useSupabaseAuth";
import ErrorNotification from "./components/ErrorNotification";
import ActionPanel from "./components/ActionPanel";
import ImageDropzone from "./components/ImageDropzone";
import UploadedImage from "./components/UploadedImage";
import ImageOutput from "./components/ImageOutput";
import ThemeSelector, { themes, type Theme } from "./components/ThemeSelector";
import Galary from "@/app/components/Galary";

const rooms = ["Living Room", "Dining Room", "Bedroom", "Bathroom", "Office"];

/**
 * Display the home page
 */
export default function HomeImageGenerator() {
  const { user, session, loading: authLoading } = useSupabaseAuth();
  const [outputImage, setOutputImage] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>("Modern");
  const [room, setRoom] = useState<string>(rooms[0]);
  const [extraPrompt, setExtraPrompt] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>("");
  const [file, setFile] = useState<File | null>(null);

  /**
   * Handle the image drop event
   * @param {Array<File>} acceptedFiles The accepted files
   * @param {Array<FileRejection>} rejectedFiles The rejected files
   * @returns void
   */
  function onImageDrop(
    acceptedFiles: File[],
    rejectedFiles: FileRejection[]
  ): void {
    // Check if any of the uploaded files are not valid
    if (rejectedFiles.length > 0) {
      console.info(rejectedFiles);
      setError("Please upload a PNG or JPEG image less than 5MB.");
      return;
    }

    removeImage();

    console.info(acceptedFiles);
    setError("");
    setFile(acceptedFiles[0]);

    // Convert to base64
    convertImageToBase64(acceptedFiles[0]);
  }

  /**
   * Convert the image to base64
   * @param {File} file The file to convert
   * @returns void
   */
  function convertImageToBase64(file: File): void {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const binaryStr = reader.result as string;
      setBase64Image(binaryStr);
    };
  }

  /**
   * Convert the file size to a human-readable format
   * @param {number} size The file size
   * @returns {string}
   */
  function fileSize(size: number): string {
    if (size === 0) {
      return "0 Bytes";
    }

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(size) / Math.log(k));

    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  /**
   * Remove the uploaded image
   * @returns void
   */
  function removeImage(): void {
    setFile(null);
    setBase64Image(null);
    setOutputImage(null);
    setError(null); // Clear any existing errors
  }

  /**
   * Download the output image
   * @returns void
   */
  function downloadOutputImage(): void {
    saveAs(outputImage as string, "output.png");
  }

  /**
   * Submit the image to the server
   * @returns {Promise<void>}
   */
  async function submitImage(): Promise<void> {
    // Check if user is authenticated before allowing image generation
    if (!session || !user) {
      setError("Please sign in to generate images.");
      return;
    }

    if (!file) {
      setError("Please upload an image.");
      return;
    }

    if (!base64Image) {
      setError("Image is still processing. Please wait and try again.");
      return;
    }

    setLoading(true);
    setError(null); // Clear previous errors

    try {
      console.log(`extraPrompt : ${extraPrompt} 
            theme: ${theme}
            room : ${room}
        `);

      const response = await fetch("/api/replicate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: base64Image, theme, room, extraPrompt }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result);

      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      // Check if output exists and is an array
      if (
        !result.output ||
        !Array.isArray(result.output) ||
        result.output.length < 2
      ) {
        setError("Invalid response from AI service. Please try again.");
        setLoading(false);
        return;
      }

      // Output returns an array of two images
      // Here we show the second image
      setOutputImage(result.output[1]);
      setLoading(false);
    } catch (error) {
      console.error("Error during image generation:", error);
      setError(
        "Failed to generate image. Please check your connection and try again."
      );
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col bg-white text-black">
      {error ? <ErrorNotification errorMessage={error} /> : null}

      {/* Show authentication prompt for non-authenticated users */}
      {!session && !authLoading && (
        <div className="mx-auto mt-8 max-w-md rounded-lg border border-orange-200 bg-orange-50 p-6 text-center">
          <div className="mb-4">
            <SparklesIcon className="mx-auto h-12 w-12 text-orange-500" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-orange-800">
            Sign in to Generate Images
          </h3>
          <p className="mb-4 text-sm text-orange-700">
            Please sign in to access our AI-powered room design generation
            feature.
          </p>
          <a
            href="/signin"
            className="inline-flex items-center rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
          >
            Sign In to Continue
          </a>
        </div>
      )}

      <ActionPanel isLoading={loading} submitImage={submitImage} />
      <section className="flex min-h-[40vh] w-full flex-col items-center justify-between gap-4 px-4 md:flex-row lg:px-6 xl:px-8">
        <section className="flex h-fit w-full md:w-1/2">
          {!file ? (
            <ImageDropzone
              title={`Drag 'n drop your image here or click to upload`}
              onImageDrop={onImageDrop}
              icon={PhotoIcon}
            />
          ) : (
            <UploadedImage
              image={file}
              removeImage={removeImage}
              file={{ name: file.name, size: fileSize(file.size) }}
            />
          )}
        </section>
        <section className="flex w-full flex-col gap-3 px-4 py-2 md:w-1/2">
          <SelectMenu
            label="Select Room Type*"
            options={rooms}
            selected={room}
            onChange={setRoom}
          />

          <ThemeSelector selectedTheme={theme} onThemeSelect={setTheme} />

          <div className="">
            <Field>
              <Label className="text-sm/6 font-medium text-gray-400">
                Enter Additional Requirements (Optional)
              </Label>
              <Textarea
                name="description"
                rows={3}
                onChange={(e) => setExtraPrompt(e.target.value)}
                className={clsx(
                  "mt-3 block w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm  text-gray-900 ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500",
                  "focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-indigo-200"
                )}
              />
            </Field>
          </div>
        </section>
      </section>
      <section className="mx-4 mt-2 lg:mx-6 xl:mx-8">
        <ImageOutput
          title={`AI-generated output goes here`}
          downloadOutputImage={downloadOutputImage}
          outputImage={outputImage}
          icon={SparklesIcon}
          loading={loading}
        />
      </section>
      <Galary />
    </main>
  );
}

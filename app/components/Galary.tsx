"use client";

import React from "react";
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";

const imagePairs = [
  {
    original:
      "https://reroom.ai/_next/image?url=https%3A%2F%2Freroom.s3.amazonaws.com%2Fassets%2Flanding%2Fjtbd%2Fcase-3d-original.jpg&w=2048&q=75",
    rendered:
      "https://reroom.ai/_next/image?url=https%3A%2F%2Freroom.s3.amazonaws.com%2Fassets%2Flanding%2Fjtbd%2Fcase-3d-rendered.jpg&w=2048&q=75",
  },
];

const bottomImages = [
  "https://reroom.ai/_next/image?url=https%3A%2F%2Freroom.s3.amazonaws.com%2Fassets%2Flanding%2Fphotostrip%2Fgallery-0-original.jpg&w=1080&q=75 ",
  "https://reroom.ai/_next/image?url=https%3A%2F%2Freroom.s3.amazonaws.com%2Fassets%2Flanding%2Fphotostrip%2Fgallery-1-original.jpg&w=1080&q=75",
  "https://reroom.ai/_next/image?url=https%3A%2F%2Freroom.s3.amazonaws.com%2Fassets%2Flanding%2Fphotostrip%2Fgallery-2-original.jpg&w=1080&q=75",
  "https://reroom.ai/_next/image?url=https%3A%2F%2Freroom.s3.amazonaws.com%2Fassets%2Flanding%2Fphotostrip%2Fgallery-3-original.jpg&w=1080&q=75",
];

const Galary: React.FC = () => {
  return (
    <div className="mx-auto flex w-full flex-col items-center justify-center bg-white py-12 sm:py-24">
      <div className="text-start">
        <h2 className="font-title text-pri mb-4 mt-12 px-8 text-2xl font-light sm:mb-4 sm:mt-36 sm:px-0 sm:text-4xl">
          Transform Concepts
          <span className="font-semibold"> into Stunning Renders</span>
        </h2>
        <p className="text-sec mb-4 px-8 text-sm font-light sm:px-0 sm:text-lg">
          Turn any concept form into realistic, eye-catching interior renders
          that bring ideas to life.
        </p>
        <div className="mt-4 flex w-full justify-between px-8 text-start sm:mt-6 sm:px-0">
          <button className="border-btn text-btn bg-btn hover:border-btn-h hover:bg-btn-h hover:text-btn-h h-fit rounded-full border-2 border-orange-700 px-6 py-2 text-sm font-medium text-orange-700 transition-all duration-100 hover:bg-orange-100">
            Get Started
          </button>
        </div>
      </div>

      {/* Comparison Sliders Section */}
      <section className="mx-auto mt-10 w-full max-w-6xl px-4">
        {/* Top Title Section */}

        {/* Before/After Comparison Sliders */}
        <div className="flex flex-col justify-center gap-6 sm:flex-row">
          {imagePairs.map((pair, idx) => (
            <div
              key={idx}
              className="relative max-w-sm flex-1 overflow-hidden rounded-lg shadow-lg"
            >
              <ReactCompareSlider
                itemOne={
                  <ReactCompareSliderImage src={pair.original} alt="Original" />
                }
                itemTwo={
                  <ReactCompareSliderImage
                    src={pair.rendered}
                    alt="AI Rendering"
                  />
                }
                style={{ height: "300px" }}
              />

              {/* Labels inside the image */}
              <div className="absolute left-2 top-2 rounded  px-2 py-1 text-xs text-white">
                Original
              </div>
              <div className="absolute right-2 top-2 rounded  px-2 py-1 text-xs text-white">
                AI Generated
              </div>
            </div>
          ))}
        </div>

        {/* Labels */}
        <div className="mb-2 mt-12 flex items-center justify-between px-1 text-sm font-medium">
          <span>Original</span>
          <span>Result</span>
        </div>

        {/* Scrollable Image Row */}
        <div className="overflow-x-auto">
          <div className="flex gap-4">
            {bottomImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Render ${index}`}
                className="h-44 w-64 flex-shrink-0 rounded-lg object-cover shadow-md"
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Galary;

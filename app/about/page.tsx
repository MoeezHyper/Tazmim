"use client";

import React from "react";
import Image from "next/image";

const metrics = [
  { label: "Countries Reached", value: "150+" },
  { label: "Monthly Subscribers", value: "2000+" },
  { label: "Daily Renders", value: "9000+" },
];

const Page = () => {
  return (
    <div className="relative mt-6 flex w-full flex-col items-center bg-white pb-20 pt-12 text-gray-900 sm:pb-[180px] sm:pt-24">
      {/* Section 1: Intro + Image */}
      <div className="mb-24 flex max-w-5xl flex-col items-center gap-6 sm:mb-36 sm:flex-row sm:gap-14">
        <div>
          <h2 className="font-title mb-5 px-10 text-3xl font-normal text-gray-900 sm:mb-8 sm:px-0 sm:text-4xl">
            Revolutionizing the Design Process with AI
          </h2>
          <p className="sm:text-md mb-4 px-10 text-sm font-light text-gray-700 sm:px-0">
            At ReRender AI, we are redefining the way design comes to life. Our
            platform combines state-of-the-art AI with a comprehensive suite of
            creative tools, empowering designers, architects, and creators to
            break boundaries and elevate their work beyond traditional methods.
          </p>
          <p className="sm:text-md px-10 text-sm font-light text-gray-700 sm:px-0">
            From transforming image quality and editing with precision to
            generating dynamic videos from still images, ReRender AI is here to
            support every step of your creative journey.
          </p>
        </div>
        {/* Light Mode Image Only */}
        <Image
          alt="about"
          width={500}
          height={500}
          className="w-1/2 object-contain sm:w-auto"
          src="https://reroom.s3.amazonaws.com/assets/landing/illustration_4.png"
        />
      </div>

      {/* Section 2: Technology + Image */}
      <div className="flex max-w-5xl flex-col items-center gap-14 sm:flex-row">
        <div className="hidden w-full sm:block">
          <Image
            alt="about"
            width={300}
            height={300}
            className="object-contain"
            src="https://reroom.s3.amazonaws.com/assets/landing/illustration_3.png"
          />
        </div>
        <div>
          <h2 className="font-title mb-5 px-10 text-3xl font-normal text-gray-900 sm:mb-8 sm:px-0 sm:text-4xl">
            Powered by Technology, Driven by Design
          </h2>
          <p className="sm:text-md mb-4 px-10 text-sm font-light text-gray-700 sm:px-0">
            We are a dedicated team of visionaries with expertise in computer
            science, AI, and architecture. This unique combination fuels our
            mission to blend cutting-edge technology with real-world design
            needs.
          </p>
          <p className="sm:text-md px-10 text-sm font-light text-gray-700 sm:px-0">
            Our goal is simple yet ambitious: to make rendering powerful,
            accessible, and intuitive for everyone.
          </p>
        </div>
      </div>

      {/* Section 3: Metrics */}
      <div className="mt-20 w-full bg-gray-100 px-10 py-12 sm:mt-36 sm:px-0 sm:py-20">
        <div className="mx-auto flex max-w-5xl flex-col">
          <div>
            <h2 className="font-title mb-10 text-3xl font-normal text-gray-900 sm:text-4xl">
              Our Metrics
            </h2>
          </div>
          <div className="flex w-full flex-col gap-10 sm:flex-row sm:justify-between">
            {metrics.map((item) => (
              <div
                key={item.label}
                className="flex flex-col gap-2 sm:items-center"
              >
                <h3 className="text-2xl font-bold text-gray-900 sm:text-5xl">
                  {item.value}
                </h3>
                <p className="sm:text-md text-xs text-gray-600">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 4: Final Illustration */}
      <div className="mt-20 flex max-w-5xl items-center gap-14 px-10 sm:mt-32 sm:px-0">
        <Image
          alt="about"
          width={800}
          height={800}
          className="object-contain"
          src="https://reroom.s3.amazonaws.com/assets/landing/illustration_5.png"
        />
      </div>
    </div>
  );
};

export default Page;

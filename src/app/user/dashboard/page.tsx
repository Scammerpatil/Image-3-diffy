"use client";
import React from "react";
import { useUser } from "@/context/UserContext";

const UserDashboardPage = () => {
  const { user } = useUser();

  return (
    <>
      <h1 className="text-3xl font-bold text-primary mb-8 text-center">
        Welcome, {user?.name}!
      </h1>

      {/* Sketch to Image Section */}
      <section className="mb-12 bg-base-300 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">🖊️ Sketch to Image</h2>
        <p className="text-base-content/80 text-lg mb-2">
          Our AI pipeline allows users to upload sketches and generate
          photo-realistic images using a trained U-Net model. The process
          involves:
        </p>
        <ul className="list-disc list-inside text-base-content/70">
          <li>Image Preprocessing (resizing, normalization)</li>
          <li>Sketch Input (edge map or pencil sketch)</li>
          <li>U-Net based image-to-image translation</li>
          <li>Output: High-resolution, colored photographic image</li>
        </ul>
      </section>

      {/* Sketch to GLB Model */}
      <section className="mb-12 bg-base-300 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">📦 Sketch to GLB Model</h2>
        <p className="text-base-content/80 text-lg mb-2">
          We’re also working on generating 3D `.glb` models from sketches by:
        </p>
        <ul className="list-disc list-inside text-base-content/70">
          <li>Sketch segmentation and depth estimation</li>
          <li>3D mesh reconstruction from line data</li>
          <li>Exporting to GLB format using Blender APIs or Three.js</li>
        </ul>
        <p className="text-sm mt-2 italic text-warning">
          * This is an experimental feature under active development.
        </p>
      </section>

      {/* Workflow Image */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">🔁 Training Workflow</h2>
        <p className="text-base-content/80 text-lg mb-4">
          The following diagram illustrates the end-to-end training pipeline of
          our sketch-to-image model:
        </p>
        <div className="w-full flex justify-center">
          <img
            src="/training_flow.png"
            alt="Workflow Diagram"
            className="rounded-xl border shadow-lg max-w-full"
          />
        </div>
      </section>
    </>
  );
};

export default UserDashboardPage;

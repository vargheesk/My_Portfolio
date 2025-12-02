"use client";
import React from "react";
import { SparklesCore } from "./ui/sparkles";

export function SparklesSeparator({ lineWidth = "w-full", gradientColor = "via-indigo-500" }) {
    return (
        <div className="w-full mx-auto h-96 relative hidden dark:block -mb-80">
            {/* Gradients */}
            <div className={`absolute inset-x-0 mx-auto top-0 bg-gradient-to-r from-transparent ${gradientColor} to-transparent h-[2px] ${lineWidth} blur-sm`} />
            <div className={`absolute inset-x-0 mx-auto top-0 bg-gradient-to-r from-transparent ${gradientColor} to-transparent h-px ${lineWidth}`} />
            <div className={`absolute inset-x-0 mx-auto top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-3/4 blur-sm`} />
            <div className={`absolute inset-x-0 mx-auto top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-3/4`} />

            {/* White Core for Dark Mode Visibility */}
            <div className={`absolute inset-x-0 mx-auto top-0 bg-gradient-to-r from-transparent via-white to-transparent h-px ${lineWidth} opacity-50`} />

            {/* Core component */}
            <SparklesCore
                background="transparent"
                minSize={0.4}
                maxSize={1}
                particleDensity={9200}
                className="w-full h-full [mask-image:radial-gradient(50%_100%_at_top,white,transparent)]"
                particleColor="#FFFFFF"
                speed={0.5}
            />
        </div>
    );
}

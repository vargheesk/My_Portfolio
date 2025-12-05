import { motion, useAnimation } from 'framer-motion';
import { useEffect, useState } from 'react';

const MINIMUM_LOADING_TIME = 1500; // 1.5 seconds minimum

export default function LoadingScreen({ onComplete, imagesToPreload = [] }) {
    const controls = useAnimation();
    const barControls = useAnimation();
    const [isReady, setIsReady] = useState(false);
    const [progress, setProgress] = useState(0);

    // Preload images and track progress
    useEffect(() => {
        const startTime = Date.now();

        const preloadImages = async () => {
            // If no images to preload, just wait for document ready
            if (imagesToPreload.length === 0) {
                // Wait for document to be fully loaded
                await new Promise(resolve => {
                    if (document.readyState === 'complete') {
                        resolve();
                    } else {
                        window.addEventListener('load', resolve);
                    }
                });
            } else {
                let loaded = 0;
                const total = imagesToPreload.length;

                const loadImage = (src) => {
                    return new Promise((resolve) => {
                        if (!src) {
                            loaded++;
                            setProgress((loaded / total) * 100);
                            resolve();
                            return;
                        }
                        const img = new Image();
                        img.onload = () => {
                            loaded++;
                            setProgress((loaded / total) * 100);
                            resolve();
                        };
                        img.onerror = () => {
                            loaded++;
                            setProgress((loaded / total) * 100);
                            resolve(); // Still resolve on error to not block
                        };
                        img.src = src;
                    });
                };

                await Promise.all(imagesToPreload.map(loadImage));
            }

            // Ensure minimum loading time
            const elapsed = Date.now() - startTime;
            if (elapsed < MINIMUM_LOADING_TIME) {
                await new Promise(resolve => setTimeout(resolve, MINIMUM_LOADING_TIME - elapsed));
            }

            setIsReady(true);
        };

        preloadImages();
    }, [imagesToPreload]);

    // Run exit animation when ready
    useEffect(() => {
        if (!isReady) return;

        const sequence = async () => {
            // Complete the bar animation
            await barControls.start({
                scaleX: 1,
            }, {
                duration: 0.3,
                ease: "easeOut"
            });

            // Brief pause to show completion
            await new Promise(resolve => setTimeout(resolve, 200));

            // Fade out bar
            barControls.start({
                opacity: 0,
            }, {
                duration: 0.3,
                ease: [0.16, 1, 0.3, 1]
            });

            // Fade out text
            await controls.start({
                opacity: 0,
                filter: 'blur(0px)'
            }, {
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1]
            });

            if (onComplete) {
                onComplete();
            }
        };

        sequence();
    }, [isReady, controls, barControls, onComplete]);

    // Animate bar based on progress while loading
    useEffect(() => {
        if (!isReady) {
            barControls.start({
                scaleX: progress / 100,
            }, {
                duration: 0.2,
                ease: "linear"
            });
        }
    }, [progress, isReady, barControls]);

    // Initial text animation
    useEffect(() => {
        controls.start({
            opacity: 1,
            filter: 'blur(0px)',
        }, {
            duration: 1,
            ease: [0.16, 1, 0.3, 1]
        });
    }, [controls]);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white dark:bg-black px-8"
        >
            <div>
                <motion.h1
                    initial={{
                        opacity: 0,
                        filter: 'blur(10px)'
                    }}
                    animate={controls}
                    className="text-4xl md:text-6xl text-center font-medium tracking-tightest text-black dark:text-white"
                >
                    PORTFOLIO OF VARGHEESKUTTY ELDHOSE.
                </motion.h1>

                <motion.div
                    className="h-0.5 w-full mt-4 bg-black/80 dark:bg-white/80"
                    initial={{ scaleX: 0, width: "100%" }}
                    animate={barControls}
                    style={{
                        originX: 0,
                    }}
                />

                {!isReady && (
                    <motion.p
                        className="text-center mt-4 text-sm text-black/50 dark:text-white/50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        Loading resources...
                    </motion.p>
                )}
            </div>
        </motion.div>
    );
}

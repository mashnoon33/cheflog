"use client"
import { useEffect, useState } from 'react';
import { ProvenanceCard, ScalingCard, TimerCard } from './card';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const features = ["timer", "scaling", "provenance",] as const;
type Feature = (typeof features)[number];

const featureList: {
    feature: Feature;
    title: string;
    description: string;
}[] = [
        {
            feature: "timer",
            title: "Timer",
            description: "Encoded timer in the recipe instruction spawn timer in the UI",
        },
        {
            feature: "scaling",
            title: "Scaling",
            description: "Scale the recipe to the desired number of servings",
        },
        {
            feature: "provenance",
            title: "Provenance",
            description: "Track how a certain recipe was derived. Users can see version history, who it was forked from and/or which website it was originally published on.",
        },

    ]

export function FeatureSection() {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        let autoToggleTimeout: ReturnType<typeof setTimeout>;
        if (!isDirty) {
            const interval = setInterval(() => {
                setSelectedIndex((prevIndex) => (prevIndex + 1) % featureList.length);
            }, 3000);
            autoToggleTimeout = setTimeout(() => {
                setIsDirty(false);
            }, 30000);
            return () => {
                clearInterval(interval);
                clearTimeout(autoToggleTimeout);
            };
        }
    }, [isDirty]);

    const handleClick = (index: number) => {
        setSelectedIndex(index);
        setIsDirty(true);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2  border rounded-xl overflow-hidden">
            <div className="flex flex-row  md:flex-col  order-2 md:order-1  border-t md:border-r md:border-t-0 border-gray-300">
                {featureList.map((feature, index) => (
                    <div
                        className={`flex flex-row md:flex-col group border-gray-300 ${
                            selectedIndex === index ? 'border-t-2 border-t-blue-500 md:border-t-0 md:border-r-2 md:border-r-blue-500' : ''
                        } ${index === featureList.length - 1 ? '' : 'border-r md:border-b'} border-t-2 md:border-t-0`}
                    >
                        <Card
                            onClick={() => handleClick(index)}
                            key={feature.feature}
                            className={cn("rounded-none border-none",
                                "md:min-h-20 cursor-pointer p-4 transition-colors duration-300",
                                selectedIndex === index
                                    ? " border-blue-500 bg-blue-100 text-blue-600"
                                    : "bg-white",
                                "group-hover:border-blue-400 group-hover:bg-blue-50"
                            )}
                        >
                            <CardTitle className={cn("", selectedIndex === index ? "text-blue-600" : "text-gray-800", "group-hover:text-blue-500")}>{feature.title}</CardTitle>
                            <CardDescription className={cn("transition-colors duration-300", selectedIndex === index ? "text-blue-600" : "text-gray-600", "group-hover:text-blue-600")}>
                                {feature.description}
                            </CardDescription>
                        </Card>
                    </div>
                ))}
            </div>
            <div className="h-[300px] md:h-full flex order-1 md:order-2" onClick={() => setIsDirty(true)}>
                {featureList[selectedIndex]?.feature === "timer" && <TimerCard />}
                {featureList[selectedIndex]?.feature === "scaling" && <ScalingCard />}
                {featureList[selectedIndex]?.feature === "provenance" && <ProvenanceCard />}
            </div>
        </div>
    );
}
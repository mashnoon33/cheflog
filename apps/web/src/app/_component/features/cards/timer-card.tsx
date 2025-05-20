import { Card } from "@/components/ui/card";
import { Timer } from "@/components/ui/timer";
import { StepsOverlay } from "./shared";

export function TimerCard() {
    const timers = [
        {
            id: "timer1",
            label: "Simmer carrots",
            duration: 1000000,
        },
        {
            id: "timer2",
            label: "Soy reduction",
            duration: 3000000,
        }
    ];
    return (
        <Card className="w-full border-none relative overflow-hidden rounded-none">
            <StepsOverlay />
            <div className="absolute bottom-0 right-0 p-4">
                <div className="flex flex-col gap-2">
                    {timers.map(timer => (
                        <Timer
                            key={timer.id}
                            id={timer.id}
                            label={timer.label}
                            duration={timer.duration}
                            startTime={Date.now()}
                            onStop={() => { /* handle stop */ }}
                            onPause={() => { /* handle pause */ }}
                            onResume={() => { /* handle resume */ }}
                            onDelete={() => { /* handle delete */ }}
                            isRunning={true}
                        />
                    ))}
                </div>
            </div>
        </Card>
    );
} 
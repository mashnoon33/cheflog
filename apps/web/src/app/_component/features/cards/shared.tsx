import { Steps } from "@/components/recipie/detail/steps";

// Shared demo steps for all cards
export const demoSteps = [
    "Line a 10 1/2– by 5 1/2–inch loaf pan with a 9- by 13-inch sheet of parchment paper, or two 9- by 5-inch loaf pans with 7- by 13-inch sheets of parchment paper.",
    "Adjust oven rack to lower-middle position and preheat to 350°F.",
    "Peel bananas (for roughly 12 ounces or 340g fruit) and mash with Greek yogurt, eggs, and vanilla in a medium bowl.",
    "If bananas are underripe, cover bowl with plastic and let mixture stand 30 minutes.",
    "Combine flour, sugar, oat flour, baking powder, baking soda, salt, cinnamon, cloves, nutmeg, and coconut oil in the bowl of a stand mixer fitted with a paddle attachment.",
    "Mix on low until coconut oil disappears into a mealy powder.",
    "Add banana mash and continue mixing only until the floury bits disappear.",
    "Fold in nuts with a flexible spatula, scrape into prepared pan(s), and spread into an even layer.",
    "Bake until well risen and golden brown, or to an internal temperature of around 206°F (97°C), about [70 minutes] for a large loaf or 45 for small.",
    "Wrapped tightly in foil, banana bread will keep up to 3 days at room temperature or 1 week in the fridge.",
    "Serve with Banana Whipped Cream, if desired."
];

// Shared Steps overlay component
export function StepsOverlay() {
    return (
        <div className="absolute bottom-0 right-0 p-4 blur-sm ">
            <Steps instructions={demoSteps} accum={1} />
        </div>
    );
} 
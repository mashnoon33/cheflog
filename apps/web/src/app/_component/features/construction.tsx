import { Card } from "@/components/ui/card";

export function Construction() {
  return (
    <Card className="flex h-[300px] flex-col items-center justify-center px-5 text-muted-foreground text-sm">
      <span>
        Oops you're here a bit early.
        :)){" "}
      </span>
      <span>
        If you'd like to contribute to the project, please check out the{" "}
        <a href="https://github.com/mashnoon33/cheflog" className="text-blue-500">
          GitHub repository
        </a>
        .
      </span>
    </Card>
  );
}

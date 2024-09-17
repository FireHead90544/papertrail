import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-switcher";

export default function Home() {
  return (
    <div className="h-screen w-full flex flex-col justify-center items-center space-y-4">
      <h1 className="text-5xl font-thin">Hello, world!</h1>
      <div className="flex space-x-2">
        <Button>Generate</Button>
        <ThemeToggle />
      </div>
    </div>
  );
}

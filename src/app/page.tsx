import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to AI Astrology</h1>
      <p className="text-xl mb-8 max-w-2xl">
        Discover your cosmic destiny with our AI-powered astrology app. Get
        personalized insights and daily horoscopes for all zodiac signs.
      </p>
      <div className="flex space-x-4">
        <Button asChild>
          <Link href="/ask">Ask the Stars</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/today">View Today&apos;s Forecast</Link>
        </Button>
      </div>
    </div>
  );
}

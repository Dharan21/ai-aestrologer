"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTodaysHoroscope } from "@/lib/server-utils";

const zodiacSigns = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

export default function TodaysDayPage() {
  const [prediction, setPrediction] = useState<string>("");
  const [activeTab, setActiveTab] = useState(zodiacSigns[0].toLowerCase());
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab) {
      setPrediction("Loading...");
      getTodaysHoroscope(activeTab).then((horoscope) => {
        setPrediction(horoscope);
      });
    }
  }, [activeTab]);

  const scroll = (direction: "left" | "right") => {
    if (tabsRef.current) {
      const scrollAmount = 200;
      tabsRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Today&apos;s Cosmic Forecast</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-center items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="min-w-12 z-10"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div
            ref={tabsRef}
            className="overflow-x-auto scrollbar-hide rounded-lg"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <TabsList className="inline-flex w-max p-1 h-auto">
              {zodiacSigns.map((sign) => (
                <TabsTrigger
                  key={sign}
                  value={sign.toLowerCase()}
                  className="px-3 py-1.5 text-sm"
                >
                  {sign}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="min-w-12 z-10"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                {activeTab[0].toUpperCase() + activeTab.substring(1)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p
                className="text-lg"
                dangerouslySetInnerHTML={{ __html: prediction || "Loading..." }}
              ></p>
            </CardContent>
          </Card>
        </div>
      </Tabs>
    </div>
  );
}

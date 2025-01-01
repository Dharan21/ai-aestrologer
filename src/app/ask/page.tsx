"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import dynamic from "next/dynamic";
import ClipLoader from "react-spinners/ClipLoader";

import { callAstrologyAPI } from "@/lib/server-utils";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export default function AskQuestionPage() {
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState("00:00");
  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(`Sagittarius Horoscope (Today)
General Overview: Sagittarius, today brings a mix of adventurous energy and introspection. Embrace spontaneity while also taking time to reflect on your inner journey.

Emotional Outlook: Your emotional state may feel a bit unsettled today, Sagittarius. Be open to addressing any underlying feelings that arise, and communicate openly with loved ones to strengthen your relationships.

Career and Finances: Career opportunities may present themselves today, so keep an eye out for new paths to explore. Financially, it's a good time to review your budget and make any necessary adjustments for long-term stability.

Health and Wellness: Prioritize your health today, Sagittarius. Engage in activities that rejuvenate both your body and mind. Remember to stay hydrated and nourish yourself with wholesome foods.

Lucky Numbers and Colors: Lucky numbers for today are 7, 14, 21. Embrace the colors blue and green to attract positive energy and luck your way.

Advice: Embrace change with an open heart, Sagittarius. Remember that growth often comes from stepping outside your comfort zone. Trust in the journey and believe in your abilities to overcome any obstacles that come your way.`);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !time || !question || !location.lat || !location.lng) {
      setAnswer("Please fill in all the details to ask the stars.");
      return;
    }
    setLoading(true);
    setLoading(true);

    try {
      const result = await callAstrologyAPI(
        date,
        time,
        location.lat,
        location.lng,
        question
      );
      if (typeof result === "string") {
        setAnswer(result);
      } else {
        setAnswer(
          result.content ??
            "Sorry, an error occurred while fetching the astrology data. Please try again later."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Ask the Stars</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle>Your Cosmic Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  type="date"
                  id="dob"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="tob">Time of Birth</Label>
                <Input
                  id="tob"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
              <div>
                <Label>Place of Birth</Label>
                <div className="h-[200px] md:h-[300px] relative">
                  <Map onLocationChange={setLocation} />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  <MapPin className="inline-block mr-1" size={16} />
                  Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}
                </p>
              </div>
              <div>
                <Label htmlFor="question">Your Question</Label>
                <Textarea
                  id="question"
                  placeholder="What do you want to ask the stars?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">
                Ask the Stars
              </Button>
            </form>
          </CardContent>
        </Card>
        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle>Cosmic Response</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ClipLoader
                loading={loading}
                size={150}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
              {answer ? (
                <p
                  className="md:max-h-[700px] overflow-auto"
                  dangerouslySetInnerHTML={{ __html: answer }}
                ></p>
              ) : (
                !loading && (
                  <p className="text-muted-foreground">
                    Your answer will appear here...
                  </p>
                )
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

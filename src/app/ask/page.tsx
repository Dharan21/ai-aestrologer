"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import dynamic from "next/dynamic";

import { callAstrologyAPI } from "@/lib/server-utils";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export default function AskQuestionPage() {
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState("00:00");
  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !time || !question || !location.lat || !location.lng) {
      setAnswer("Please fill in all the details to ask the stars.");
      return;
    }

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
            <div className="h-full flex items-center justify-center">
              {answer ? (
                <p>{answer}</p>
              ) : (
                <p className="text-muted-foreground">
                  Your answer will appear here...
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

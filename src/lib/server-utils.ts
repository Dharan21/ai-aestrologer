"use server";

import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const generateTodaysHoroscope = async (sign: string) => {
  // call openai api to generate horoscope for input zodiac signs
  const prompt = `Generate a horoscope for ${sign} for today.`;
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      store: false,
      messages: [
        { role: "system", content: "You are an astrologer assistant." },
        { role: "user", content: prompt },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error generating horoscope:", error);
    return "";
  }
};

export const callAstrologyAPI = async (
  dateOfBirth: string,
  timeOfBirth: string,
  latitude: number,
  longitude: number,
  question: string
) => {
  try {
    const prompt = `Provide an vedic astrological reading based on the following details:\n
    - Date of Birth: ${dateOfBirth}\n- Time of Birth: ${timeOfBirth}\n- Place of Birth (Approximate Latitude, Longitude): ${latitude}, ${longitude}\n\nThe user has asked: ${question}`;

    // Call the OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      store: false,
      messages: [
        { role: "system", content: "You are an astrologer assistant." },
        { role: "user", content: prompt },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    return response.choices[0].message;
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return "Sorry, an error occurred while fetching the astrology data. Please try again later.";
  }
};

export const getTodaysHoroscope = async (sign: string) => {
  const q = query(
    collection(db, "horoscopes"),
    where("sign", "==", sign),
    where("date", ">=", new Date(new Date().setHours(0, 0, 0, 0))),
    where("date", "<=", new Date(new Date().setHours(23, 59, 59, 999))),
    limit(1)
  );

  const docs = await getDocs(q);
  if (docs.empty) {
    const response = await generateTodaysHoroscope(sign);
    if (response) {
      await addDoc(collection(db, "horoscopes"), {
        sign,
        date: new Date(),
        prediction: response,
      });
      return response;
    }
  }

  return docs.docs[0].data().prediction;
};

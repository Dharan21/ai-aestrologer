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
  apiKey: process.env.OPENAI_API_KEY,
});

const generateTodaysHoroscope = async (sign: string) => {
  // call openai api to generate horoscope for input zodiac signs
  const prompt = `Generate a detailed horoscope for the astrological sign of ${sign} for today. The horoscope should include the following components:
    1. General Overview: A brief summary of the day’s energy and themes for the sign.
    2. Emotional Outlook: Insights into the emotional state and relationship dynamics.
    3. Career and Finances: Predictions related to work, career opportunities, and financial matters.
    4. Health and Wellness: Advice on health, fitness, and overall well-being.
    5. Lucky Numbers and Colors: Suggest specific numbers and colors that may bring luck today.
    6. Advice: Provide a piece of actionable advice or a mantra for the day.
    7. Use html tags to format the horoscope for readability.
    Ensure that the tone is positive and empowering, while also incorporating realistic challenges that may arise. Use engaging language that resonates with individuals seeking guidance`;

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
    const prompt = `You are an expert Vedic astrologer. Using the provided details: 
      Date of Birth - ${dateOfBirth}, 
      Time of Birth - ${timeOfBirth}, 
      Place of Birth (latitude - ${latitude}, longitude - ${longitude}),
      Generate a comprehensive astrological reading. Incorporate the following elements into your analysis:
      1. Answer the Question: Provide a clear and insightful response to the user's question, supported by astrological reasoning and interpretations based on the birth chart and current transits. (User's Question: ${question})
      2. Structure: Ensure the reading is well-structured, clear, and accessible to someone who may not have extensive knowledge of Vedic astrology. Use a respectful and compassionate tone throughout the reading.
      3. Formatting: Use HTML tags to format the horoscope for readability, such as <h1> for headings, <p> for paragraphs, and <ul> for lists.
      4. Clarity: Avoid jargon and explain any astrological terms you use in simple language, providing context and meaning.
      5. Depth: Include insights on the user's personality traits, strengths, weaknesses, and potential life paths based on their astrological chart.
      6. Current Influences: Discuss any significant planetary transits or aspects currently affecting the user, and how these may impact their situation.
      Ensure that the final output is empathetic, informative, and encourages the user to reflect on their own life choices and potential paths forward.
    `;

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

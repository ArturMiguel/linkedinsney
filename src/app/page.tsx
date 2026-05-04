"use client"

import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { SocialProof } from "@/components/SocialProof";
import { Footer } from "@/components/Footer";
import { HowItWorks } from "@/components/HowItWorks";
import { Translator } from "@/components/Translator";
import { useEffect } from "react";
import * as cowsay from "cowsay";

const Index = () => {
  useEffect(() => {
    console.info(cowsay.say({ text: `Olá, dev!\nCaso encontre algo estranho neste site\n(além deste aviso), conte pra gente em\n${process.env.NEXT_PUBLIC_SITE}/contact` }), "\n^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <div id="translator" className="scroll-mt-24"><Translator /></div>
        <div id="how-it-works" className="scroll-mt-24"><HowItWorks /></div>
        <SocialProof />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

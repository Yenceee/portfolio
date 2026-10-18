"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Hero from "@/components/sections/Hero";
import AboutMeDrawer from "@/components/sections/AboutMeDrawer";

export default function Home() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <main>
      <Hero onOpenAbout={() => setDrawerOpen(true)} />
      <AnimatePresence>
        {drawerOpen && (
          <AboutMeDrawer
            isOpen={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            currentSlide={currentSlide}
            setCurrentSlide={setCurrentSlide}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

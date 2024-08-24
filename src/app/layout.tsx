"use client";

import Audio from "@/components/Audio";
import Background from "@/components/Background";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import axios from "@/lib/axios";
import React, { useEffect, useState } from "react";

const metaData = {
  title: "Next.js 123",
  description: "Generate by Next.js",
};
const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const [playing, setPlaying] = useState(false);

  const onClickBodyHandle = () => {
    setPlaying((prev) => !prev);
  };

  useEffect(() => {
    axios.get("/profile").then((res) => {
      console.log(res);
    });
  }, []);

  return (
    <html lang="en">
      <body onClick={onClickBodyHandle}>
        <Background url="https://res.cloudinary.com/dmiaubxsm/video/upload/v1724528020/pmf4ghw47tzhbc5kxc4n.mp4" />
        <header>
          <Header />
          <Audio
            url="https://res.cloudinary.com/dmiaubxsm/video/upload/v1724530611/dso0xsemrcimcaeoutus.mp3"
            playing={playing}
          />
        </header>
        <div>
          <Sidebar />
        </div>
        {/* Layout UI */}
        <main>{children}</main>
        <footer>
          <Footer />
        </footer>
      </body>
    </html>
  );
};

export default RootLayout;

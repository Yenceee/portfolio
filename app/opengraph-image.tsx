// app/opengraph-image.tsx
import { ImageResponse } from "next/og";

export const alt = "Larence Pinto | UI/UX Designer (Web & Mobile)";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 90px",
        background:
          "radial-gradient(circle at 15% 20%, rgba(0,229,184,0.18), #0A0B0D 55%)",
        color: "#F4F5F7",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 26,
          letterSpacing: 4,
          color: "#00E5B8",
          fontWeight: 600,
        }}
      >
        UI/UX DESIGNER · WEB & MOBILE
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 28,
          fontSize: 84,
          fontWeight: 700,
          lineHeight: 1.08,
          maxWidth: 980,
        }}
      >
        Designing Interfaces People Actually Enjoy Using.
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 40,
          fontSize: 34,
          color: "#A1A6AE",
        }}
      >
        Larence Mcdale S. Pinto
      </div>
      <div
        style={{
          display: "flex",
          position: "absolute",
          left: 0,
          bottom: 0,
          width: "100%",
          height: 10,
          background: "#00E5B8",
        }}
      />
    </div>,
    { ...size },
  );
}

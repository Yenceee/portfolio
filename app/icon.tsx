// app/icon.tsx
import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0A0B0D",
        borderRadius: 14,
        border: "3px solid #00E5B8",
        color: "#00E5B8",
        fontSize: 40,
        fontWeight: 700,
      }}
    >
      L
    </div>,
    { ...size },
  );
}

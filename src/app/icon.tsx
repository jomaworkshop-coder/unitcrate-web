import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24">
          {/* Top face — orange */}
          <path d="M12 2.5 20.5 7 12 11.5 3.5 7Z" fill="#ea580c" />
          {/* Left face — near-black */}
          <path d="M3.5 7 12 11.5 12 21.5 3.5 17Z" fill="#0a0a0a" />
          {/* Right face — shadow */}
          <path d="M20.5 7 12 11.5 12 21.5 20.5 17Z" fill="#0a0a0a" opacity="0.52" />
        </svg>
      </div>
    ),
    { ...size },
  );
}

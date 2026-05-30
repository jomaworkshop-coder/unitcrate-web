import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: "#fafaf7",
          borderRadius: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="110" height="110" viewBox="0 0 24 24">
          <path d="M12 2.5 20.5 7 12 11.5 3.5 7Z" fill="#ea580c" />
          <path d="M3.5 7 12 11.5 12 21.5 3.5 17Z" fill="#0a0a0a" />
          <path d="M20.5 7 12 11.5 12 21.5 20.5 17Z" fill="#0a0a0a" opacity="0.52" />
        </svg>
      </div>
    ),
    { ...size },
  );
}

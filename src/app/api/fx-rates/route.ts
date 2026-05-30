import { fetchFxRates } from "@/lib/currency";

export const revalidate = 3600;

export async function GET() {
  try {
    const rates = await fetchFxRates();
    return Response.json(rates);
  } catch {
    return Response.json({ error: "Failed to fetch rates" }, { status: 502 });
  }
}

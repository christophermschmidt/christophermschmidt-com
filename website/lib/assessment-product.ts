const gumroadUrl =
  "https://schmidtster11.gumroad.com/l/dataandaiexecassessment";

export const assessmentProduct = {
  gumroadProductId: "fuwlq",
  name: "Data and AI Readiness Executive Assessment Kit",
  price: "$49",
  purchaseUrl: validateGumroadUrl(gumroadUrl),
};

function validateGumroadUrl(value: string | undefined): string | null {
  if (!value) return null;

  try {
    const url = new URL(value);
    const isGumroadHost =
      url.hostname === "gumroad.com" || url.hostname.endsWith(".gumroad.com");

    return url.protocol === "https:" && isGumroadHost ? url.toString() : null;
  } catch {
    return null;
  }
}

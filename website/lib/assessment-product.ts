const gumroadUrl = process.env.DARF_ASSESSMENT_GUMROAD_URL;

export const assessmentProduct = {
  name: "DARF Assessment Kit",
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

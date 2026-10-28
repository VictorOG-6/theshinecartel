export const redirectToPaystack = (authorizationUrl: string | null) => {
  if (!authorizationUrl) {
    throw new Error("The payment provider did not return a checkout URL.");
  }

  const url = new URL(authorizationUrl);
  const isPaystackHost =
    url.hostname === "paystack.com" || url.hostname.endsWith(".paystack.com");

  if (url.protocol !== "https:" || !isPaystackHost) {
    throw new Error("The payment provider returned an invalid checkout URL.");
  }

  window.location.assign(url.toString());
};

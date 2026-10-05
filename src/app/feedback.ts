// Sends user feedback to the backend (a Google Apps Script web app that appends
// a row to a Google Sheet, see docs/feedback-apps-script.md).
// To switch backends later, only the body of sendFeedback needs to change.

export const APP_VERSION = "1.0.0";

const FEEDBACK_URL: string | undefined = import.meta.env.VITE_FEEDBACK_URL;

export async function sendFeedback(message: string): Promise<void> {
  if (!FEEDBACK_URL) {
    throw new Error("Feedback endpoint is not configured (VITE_FEEDBACK_URL).");
  }
  // text/plain + no-cors avoids a CORS preflight, which Apps Script web apps
  // do not answer. The response is opaque, so only network failures are detectable.
  await fetch(FEEDBACK_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({
      message,
      version: APP_VERSION,
      timestamp: new Date().toISOString(),
    }),
  });
}

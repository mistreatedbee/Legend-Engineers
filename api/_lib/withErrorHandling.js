// Wraps a Vercel/Express-style (req, res) handler so an unexpected error
// (a DB hiccup, a missing env var, anything) returns a clean JSON 500
// instead of Vercel's raw "FUNCTION_INVOCATION_FAILED" crash page — which
// leaks nothing useful to the visitor and looks broken. The real error is
// still logged in full for diagnosis (visible in Vercel's function logs).
export function withErrorHandling(handler) {
  return async (req, res) => {
    try {
      return await handler(req, res);
    } catch (err) {
      console.error(`${req.method} ${req.url} error:`, err.message);
      if (res.headersSent) return;
      return res.status(500).json({
        ok: false,
        error: 'Something went wrong on our end. Please try again in a moment.',
      });
    }
  };
}

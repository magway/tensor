/**
 * Same as 'fetch', but with error handler and response.json() call
 * Throws our custom FetchError in case of errors.
 * Handles network and json errors
 */
export default async function (url, params) {
   let response;

   // in case of network troubles
   try {
      response = await fetch(url, params);
   } catch (err) {
      throw new FetchError(response, 'Network error has occurred.');
   }

   let body;

   // in case of bad response ( 299 < response.status < 200)
   if (!response.ok) {
      let errorText = response.statusText;

      try {
         body = await response.json();

         errorText = (body.error && body.error.message)
            || (body.data && body.data.error && body.data.error.message)
            || errorText;
      } catch (error) { /* ignore failed body */
      }

      let message = `Error ${response.status}: ${errorText}`;

      throw new FetchError(response, body, message);
   }

   try {
      return await response.json();
   } catch (err) {
      throw new FetchError(response, null, err.message);
   }
}

/**
 * Custom Error
 */
export class FetchError extends Error {
   name = 'FetchError';

   constructor(response, body, message) {
      super(message);
      this.response = response;
      this.body = body;
   }
}

/**
 * Handle uncaught failed fetch
 */
window.addEventListener('unhandledrejection', event => {
   if (event.reason instanceof FetchError) {
      alert(event.reason.message);
   }
});


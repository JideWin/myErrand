const functions = require("firebase-functions");
const axios = require("axios");

// IMPORTANT: Add your Paystack Secret Key to your Firebase environment variables
// Run this in your terminal:
// firebase functions:config:set paystack.secret="YOUR_PAYSTACK_SECRET_KEY"
const PAYSTACK_SECRET_KEY = functions.config().paystack.secret;

/**
 * Initializes a Paystack transaction.
 * Expects { email: 'user@email.com', amount: 5000 } in the request body.
 * Amount should be in kobo (e.g., 5000 = NGN 50.00).
 * We set a low amount (e.g., NGN 50) for card authorization.
 */
exports.initializeTransaction = functions.https.onCall(
    async (data, context) => {
    // Check if user is authenticated
      if (!context.auth) {
        throw new functions.https.HttpsError(
            "unauthenticated",
            "User must be authenticated to initialize a transaction.",
        );
      }

      const email = data.email;
      // We use a small, fixed amount for card verification.
      // Paystack recommends NGN 50 (5000 kobo) which is then refunded.
      const amount = data.amount || 5000;

      try {
        const response = await axios.post(
            "https://api.paystack.co/transaction/initialize",
            {
              email: email,
              amount: amount,
              // We add metadata to link this transaction back to the Firebase user
              metadata: {
                firebase_uid: context.auth.uid,
                custom_fields: [
                  {
                    display_name: "User ID",
                    variable_name: "firebase_uid",
                    value: context.auth.uid,
                  },
                ],
              },
            },
            {
              headers: {
                "Authorization": `Bearer ${PAYSTACK_SECRET_KEY}`,
                "Content-Type": "application/json",
              },
            },
        );

        // Send the authorization_url and reference back to the client
        return {
          success: true,
          data: response.data.data, // Contains authorization_url, access_code, reference
        };
      } catch (error) {
        console.error("Paystack initialization error:", error.response.data);
        throw new functions.https.HttpsError(
            "internal",
            "Failed to initialize Paystack transaction.",
        );
      }
    },
);

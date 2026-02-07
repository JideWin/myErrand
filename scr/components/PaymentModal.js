import React, { useState } from "react";
import { Modal, View, ActivityIndicator, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

const PaymentModal = ({ visible, amount, email, onSave, onCancel }) => {
  const [isLoading, setIsLoading] = useState(true);
  const publicKey = "pk_test_bffa0c790c3fe5f02e846a9bf39e28e3b95207bd";

  const htmlContent = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body onload="payWithPaystack()" style="background-color: #fff;">
        <script src="https://js.paystack.co/v1/inline.js"></script>
        <script>
          function payWithPaystack() {
            var handler = PaystackPop.setup({
              key: '${publicKey}',
              email: '${email}',
              amount: ${amount * 100}, 
              currency: 'NGN',
              callback: function(response) {
                window.ReactNativeWebView.postMessage(JSON.stringify({status: 'success', reference: response.reference}));
              },
              onClose: function() {
                window.ReactNativeWebView.postMessage(JSON.stringify({status: 'cancelled'}));
              }
            });
            handler.openIframe();
          }
        </script>
      </body>
    </html>
  `;

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={{ flex: 1 }}>
        <WebView
          source={{ html: htmlContent }}
          onMessage={(e) => {
            const data = JSON.parse(e.nativeEvent.data);
            if (data.status === "success") onSave(data.reference);
            else onCancel();
          }}
          onLoadEnd={() => setIsLoading(false)} // Hides spinner when HTML is ready
        />

        {isLoading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#3486eb" />
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

export default PaymentModal;

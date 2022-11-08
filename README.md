# Eradpay React Native Checkout

This project aims to be the easiest way for our merchants to consume eradpay-checkout in their React Native applications.

## Installation

npm:
>npm install @erad/eradpay-rn-sdk

yarn:
>yarn add @erad/eradpay-rn-sdk

### 1. Add react-native-webview to your dependencies

> $ yarn add react-native-webview

### `Android:`

Android - `react-native-webview` version <6: This module does not require any extra step after running the link command.

Android - `react-native-webview` version >=6.X.X: Please make sure AndroidX is enabled in your project by editting `android/gradle.properties` and adding 2 lines:

For Android manual installation, please refer to this [article](https://engineering.brigad.co/demystifying-react-native-modules-linking-964399ec731b) where you can find detailed step on how to link any react-native project.

### `iOS:`

If using CocoaPods, in the ios/ or macos/ directory run:
> $ pod install

#### Usage

#### EradpayCheckout

`EradpayCheckout` component is the main component which wraps everything and provides a couple of props (see Config below).

#### Example

``` ts
import React from 'react';
import EradpayCheckout from '@erad/eradpay-rn-sdk';
import { StyleSheet } from 'react-native';

export default function App() {
  return (
    <>
      <EradpayCheckout
        amount={+amount}
        currency={EradpayCurrencyEnum.USD}
        token={token}
        payment_id={paymentId}
        webhook_url={webhookUrl}
        environment={EradpayEnvironmentEnum.SANDBOX}
        buttonText={"Pay with eradPay"}
        buttonStyle={styles.button}
        buttonTheme={EradpayThemeEnum.DEFAULT}
        onPaymentCancelled={() => Alert.alert("Payment Cancelled!")}
        onPaymentCompleted={() => Alert.alert("Payment Successfull")}
      />
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    marginBottom: 10,
  },
});
```

#### Props Configuration

| Property | Type | Description |
| :---         |     :---:      |          :---: |
| environment     | EradpayEnvironmentEnum | use this to specify environment  |
| buttonText     | enum       | use this to specify text on your button|
| buttonTheme     | enum       | use this to specify theme to your button|
| buttonStyle     | string      | use this to give styles to your button|
| onPaymentCancelled() | function | use this to notify merchants if customer is cancelling the payment|
| onPaymentCompleted() | function | use this to notify merchants if payment is completed |

#### Payment params
See the detailed parameters list here https://docs.erad.co/accept-payments/payment-links/one-off

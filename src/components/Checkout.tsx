import React, { useState } from 'react';
import WebView, { WebViewNavigation } from 'react-native-webview';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  StyleProp,
} from 'react-native';
import queryString from 'query-string';

export enum EradpayThemeEnum {
  DEFAULT = 'deepskyblue',
  LIGHT = 'white',
  DARK = '#0e0e0e',
}
export enum EradpayEnvironmentEnum {
  SANDBOX = 'sandbox',
  LIVE = 'live',
}

export const enum EradpayCurrencyEnum {
  USD = 'usd',
  EUR = 'eur',
  GBP = 'gbp',
  AED = 'aed',
  SAR = 'sar',
}

export type EradpayPaymentType = {
  amount: number;
  currency: EradpayCurrencyEnum;
  token: string;
  payment_id: number;
  environment: EradpayEnvironmentEnum;
  webhook_url?: string;
  buttonText?: string;
  buttonStyle?: StyleProp<any>;
  buttonTheme?: EradpayThemeEnum;
  onPaymentCancelled?: () => void;
  onPaymentCompleted?: () => void;
};

const API_BASE_URL = 'https://app.erad.co/eradpay';

const EradpayCheckout: React.FC<EradpayPaymentType> = (props) => {
  const {
    amount,
    currency,
    token,
    payment_id,
    webhook_url = '',
    environment,
    buttonText = 'Checkout',
    buttonStyle,
    buttonTheme = EradpayThemeEnum.DEFAULT,
    onPaymentCancelled = () => {},
    onPaymentCompleted = () => {},
  } = props;

  const searchParamsStr = new URLSearchParams({
    amount: amount.toString(),
    currency,
    mode: environment,
    token,
    webhook_url,
    payment_id: payment_id.toString(),
  }).toString();
  const checkoutUrl = `${API_BASE_URL}?${searchParamsStr}`;

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  return (
    <TouchableOpacity
      onPress={() => setModalVisible(!modalVisible)}
      style={[
        styles.button,
        buttonStyle,
        {
          backgroundColor: buttonTheme,
          borderColor:
            buttonTheme === EradpayThemeEnum.DEFAULT ? '#6A9ADB' : '#0e0e0e',
        },
      ]}
    >
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <WebView
          source={{ uri: checkoutUrl }}
          domStorageEnabled={true}
          javaScriptEnabled={true}
          javaScriptEnabledAndroid={true}
          style={{ flex: 1 }}
          onNavigationStateChange={(event: WebViewNavigation) => {
            const url = event.url;
            const params = url.split('?')[1];
            const parsed = queryString.parse(params);
            if (parsed.complete !== '1') {
              return;
            }
            if (parsed.success === '1') {
              onPaymentCompleted();
            } else {
              onPaymentCancelled();
            }
            console.info('params', parsed);
            setModalVisible(!modalVisible);
          }}
        />
      </Modal>
      <Text
        style={[
          styles.buttonText,
          {
            color:
              buttonTheme === EradpayThemeEnum.DEFAULT
                ? 'white'
                : 'deepskyblue',
          },
        ]}
      >
        {buttonText}
      </Text>
    </TouchableOpacity>
  );
};

export default EradpayCheckout;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    marginBottom: 10,
    backgroundColor: 'deepskyblue',
  },
  buttonText: {
    fontWeight: 'bold',
  },
});

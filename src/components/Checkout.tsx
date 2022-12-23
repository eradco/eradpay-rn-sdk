import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from 'react';
import WebView, { WebViewNavigation } from 'react-native-webview';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  StyleProp,
} from 'react-native';
import queryString from 'query-string';
import {
  buildShortQueryParams,
  queryParamsConfigMap,
} from '../utils/queryParams';

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
  amount_first_time?: number;
  auth_auto_capture_mode?: string;
  auth_time?: number;
  currency: EradpayCurrencyEnum;
  customer_id?: string;
  frequency?: string;
  token: string;
  payment_id: number;
  start_date?: string;
  environment: EradpayEnvironmentEnum;
  fullname?: string;
  lastname?: string;
  email?: string;
  is_authorize_only?: boolean;
  phone_code?: string;
  phone_code_dial?: string;
  phone_number?: string;
  webhook_url?: string;
  card_form_only?: boolean;
  is_save_card?: boolean;
  lng?: string;
  buttonText?: string;
  buttonStyle?: StyleProp<any>;
  buttonTheme?: EradpayThemeEnum;
  onPaymentCancelled?: () => void;
  onPaymentCompleted?: () => void;
  product_name?: string;
  is_case_sensitive?: boolean;
};

type PressRefHandle = {
  press: () => void;
};

const API_BASE_URL = 'https://app.erad.co/eradpay';

const EradpayCheckout: React.FC<EradpayPaymentType> = forwardRef<
  PressRefHandle,
  EradpayPaymentType
>((props, ref) => {
  const {
    amount,
    amount_first_time = 0,
    auth_auto_capture_mode = '',
    auth_time = 0,
    currency,
    customer_id,
    frequency,
    token,
    payment_id,
    start_date = '',
    webhook_url = '',
    fullname = '',
    lastname = '',
    email = '',
    is_authorize_only = false,
    phone_code = '',
    phone_code_dial = '',
    phone_number = '',
    card_form_only = false,
    is_save_card = false,
    lng = 'en',
    environment,
    buttonText = 'Checkout',
    buttonStyle,
    buttonTheme = EradpayThemeEnum.DEFAULT,
    onPaymentCancelled = () => {},
    onPaymentCompleted = () => {},
    product_name,
    is_case_sensitive,
  } = props;

  const queryParams = {
    amount: amount.toString(),
    amount_first_time: amount_first_time.toString(),
    auth_auto_capture_mode,
    auth_time: auth_time.toString(),
    currency,
    customer_id,
    frequency,
    mode: environment,
    token,
    webhook_url,
    fullname,
    lastname,
    email,
    is_authorize_only: is_authorize_only ? 1 : 0,
    phone_code,
    phone_code_dial,
    phone_number,
    card_form_only: card_form_only ? 1 : 0,
    is_save_card: is_save_card ? 1 : 0,
    lng,
    payment_id: payment_id.toString(),
    start_date,
    platform: 'rn',
    product_name: encodeURIComponent(product_name || ''),
  };

  const generateParams = new URLSearchParams(
    buildShortQueryParams(queryParams, queryParamsConfigMap)
  ).toString();

  const searchParams = is_case_sensitive
    ? generateParams
    : generateParams.toLowerCase();

  const checkoutUrl = `${API_BASE_URL}?${searchParams}`;

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  console.log('eradpay url:', checkoutUrl);

  const handleButtonPress = useCallback(() => {
    setModalVisible(!modalVisible);
  }, [modalVisible]);

  useImperativeHandle(ref, () => ({
    press() {
      handleButtonPress();
    },
  }));

  return (
    <TouchableOpacity
      onPress={() => handleButtonPress()}
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
          startInLoadingState={true}
          style={{ 
            flex: 1,
            width: Dimensions.get('window').width, 
            height: Dimensions.get('window').height
          }}
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
});

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

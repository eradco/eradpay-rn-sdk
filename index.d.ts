import React from 'react';
import {
  EradpayPaymentType,
  EradpayThemeEnum,
  EradpayEnvironmentEnum,
  EradpayCurrencyEnum,
} from './src/components/checkout';
export { EradpayThemeEnum, EradpayEnvironmentEnum, EradpayCurrencyEnum };
declare const EradpayCheckout: React.FC<EradpayPaymentType>;
export default EradpayCheckout;

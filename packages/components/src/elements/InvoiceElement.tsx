import React, { useEffect } from 'react';
import { Box, extend, Text, useWindowDimensions } from 'elemental-react';
import {
  Icon, TextInput, InputField, TruncatedZAddress, CryptoAddressCopy, QRCode, Button, AutoTextArea, Select,
} from '@elemental-zcash/components';

// const WalletOpenButton = ({ ...props }) => (
//   <DefaultButton></>
// );


// @ts-ignore
const AmountText: any = extend(Text, () => ({ fontFamily: 'IBM Plex Mono', fontWeight: '500', fontSize: 30, color: 'black', letterSpacing: '0.01px' }));

const AmountSection = ({ amount, currency, fontSize, ...props }: { amount?: number, currency?: string, fontSize?: string | number }) => {
  return (
    <>
      <AmountText fontSize={fontSize || [24, 32, 40]} {...props}>
        PAY <AmountText bold fontFamily="IBM Plex Mono" fontSize={fontSize || [24, 32, 40]} {...props}>{`${amount} ${currency}`}</AmountText> TO
      </AmountText>
    </>
  );
};
const ScanSection = () => null;
const CopySection = () => null;



const InvoiceElement = ({ onCopyPress, address = '', memo = '', amount, currency = 'ZEC', components }: {
  amount: number, currency: string, onCopyPress: Function, components: any, address: string, memo?: string,
}) => {
  const { width, height } = useWindowDimensions();
  // const zecpagesAddress = 'zs1j29m7zdhhyy2eqrz89l4zhk0angqjh368gqkj2vgdyqmeuultteny36n3qsm47zn8du5sw3ts7f';
  // const amount = 0.512;
  useEffect(() => {

  })
  const { WalletButtonContainer = Box } = components;

  return (
    <Box alignItems="center" flex={1}>
      <Box mb={40}>
        <AmountSection
          amount={amount}
          currency={currency}
        />
      </Box>
      <Text></Text>
      <Box mb={40} flex={1} alignItems="center">
        <QRCode
          bgColor="#ffffff"
          fgColor="#000000"
          includeMargin={true}
          // style={{ width: width * 0.55, height: width * 0.55, maxHeight: 512, maxWidth: 512 }}
          style={{
            flex: 1, width: '100%', height: '100%',
            // maxHeight: Math.min(height * 0.55, width * 0.55, 512),
            // maxWidth: Math.min(height * 0.55, width * 0.55, 512),
          }}
          sizeWeb="100%"
          // value={`zcash:${zaddr}?amount=0.001&memo=${memo}`}
          value={`zcash:${address}?amount=${amount}&memo=${memo.replace(/=/g, '')}`}
        />
      </Box>
      <Box width="100%" maxWidth="100vw">
        <CryptoAddressCopy // @ts-ignore
          bg="#224259"
          color="white"
          address={address}
          onCopyPress={onCopyPress}
          borderRadius="2px"
          // onQrcodePress={() => {
          //   setModalState('zecpages_qrcode');
          // }}
          showQrCode={false}
          // maxWidth={width * 0.35}
          mt={3}
          mb={12}
        />
        <WalletButtonContainer>
          <Button flex={1} m="0px" bg="#F4B728" color="#224259">
            OPEN IN WALLET
          </Button>
        </WalletButtonContainer>
      </Box>
    </Box>
  );
};

export default InvoiceElement;

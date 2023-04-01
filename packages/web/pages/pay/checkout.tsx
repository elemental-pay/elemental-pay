import React, { useEffect, useState } from 'react';
import { Box, Text, Row } from 'elemental-react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { OnChangeValue } from 'react-select';
import { AutoTextArea, Button, TextInput, InputField, CryptoAddressCopy, theme, QRCode, Select } from '@elemental-zcash/components';
import { customAlphabet, nanoid } from 'nanoid';

import Layout from '../../components/Layout';
import Section from '../../components/common/Section';
import { encodeMemo } from '../../utils/zcash';
import { useRouter } from 'next/router';

const CheckoutSchema = Yup.object().shape({
  amount: Yup.number().required('Required'),
  currency: Yup.string()
    .min(3, 'Too short!')
    .max(3, 'Too long!')
    .required('Required'),
  fiat: Yup.string()
    .min(3, 'Too short!')
    .max(3, 'Too long!')
    .required('Required'),
  crypto: Yup.string(),
  businessName: Yup.string(),
  address: Yup.string().min(16, 'Too short!').required('Required'),
});

const CheckoutInputField = ({ error, value, onChange, label }) => (
  <InputField
    width="100%"
    label={label}
    error={error}
    value={value}
  >
    {({ label, value }) =>
      <TextInput
        placeholder={label}
        // @ts-ignore
        value={value}
        onChange={onChange}
        bg="white"
        pb={0}
        px={3}
        borderWidth={1}
        borderRadius={4}
        height={40}
        borderColor="#e2e2f2"
      />
    }
  </InputField>
)

const makeCheckoutInputField = (id, label, touched, errors, values, handleChange) => (
  <CheckoutInputField
    key={id}
    error={touched[id] && errors[id]}
    value={values[id]}
    label={label}
    onChange={handleChange(id)}
  />
);

type CurrencyOption = { label?: 'ZEC' | 'USD', value?: 'ZEC' | 'USD' };

type QueryParams = {
  businessName?: string,
  currency?: string,
  amount?: number,
  address?: string,
}

const Checkout = ({ zecPrice, token, invoiceId, ...props }) => {
  const router = useRouter();
  const currencyOptions: CurrencyOption[] = [{ label: 'ZEC', value: 'ZEC' }, { label: 'USD', value: 'USD' }];

  const {
    businessName: initialBusinessName = '',
    currency: initialCurrency = 'ZEC',
    amount: initialAmount = 0.1,
    address: initialAddress = '',
  } = router.query as QueryParams;
  // const [zecPrice, setZecPrice] = useState();

  // const setPrice = async () => {
  //   const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=zcash&vs_currencies=usd');
  //   const json = await res.json();

  //   try {
  //     setZecPrice(json.zcash.usd);
  //   } catch(err) {}
  // }


  // useEffect(() => {
  //   setPrice();
  // }, [])

  return (
    <Layout>
      <Section flex={1}>
        <Row flex={1}>
          <Box width="50%" p={40}>
            <Text fontSize={30} lineHeight={34} mb={20}>
              Test Out the Elemental Pay Merchant Flow
            </Text>
            <Text fontSize={20} lineHeight={24}>
              Disclaimer: this is a proof-of-concept and will evolve over the coming weeks; for now there is no account system, storage or payment validation implemented.
            </Text>
          </Box>
          <Box flex={1} p={40} bg="greys.1" borderRadius="12px">
            <Formik
              initialValues={{ businessName: initialBusinessName, amount: initialAmount, currency: 'ZEC', fiat: 'USD', crypto: 'ZEC', memo: '', address: initialAddress }}
              validationSchema={CheckoutSchema}
              onSubmit={(values) => {
                console.log({ values });
                let zecAmount = values.amount;
                if (values.currency === 'USD') {
                  const preciseZecAmount = values.amount / zecPrice;
                  zecAmount = Number(parseFloat(`${preciseZecAmount}`).toFixed(2));

                }
                router.push({
                  pathname: '/pay/invoice/[id]',
                  query: {
                    id: invoiceId,
                    zecAmount,
                    zaddress: values.address,
                    currency: values.currency,
                    businessName: values.businessName,
                    memo: encodeMemo(JSON.stringify({ token, memo: values.memo })),
                  },
                });
                // setInvoiceStage(InvoiceStage.INVOICE);
                // setAmount(values.amount);
                // setMemo(encodeMemo(values.memo));
                // // setCurrency(values.currency);
              }}
            >
              {({ values, setFieldValue, errors, touched, handleChange, handleSubmit }) => (
                <>
                  <Box>
                    {[{ id: 'businessName', label: 'Business Name' }].map(({ id, label }) =>
                      makeCheckoutInputField(id, label, touched, errors, values, handleChange)
                    )}
                  </Box>
                  <Box>
                    {[{ id: 'address', label: 'Zcash Address' }].map(({ id, label }) =>
                      makeCheckoutInputField(id, label, touched, errors, values, handleChange)
                    )}
                  </Box>
                  <Box>
                    {[{ id: 'amount', label: 'Amount' }].map(({ id, label }) =>
                      makeCheckoutInputField(id, label, touched, errors, values, handleChange)
                    )}
                  </Box>
                  <Text bold fontWeight="bold" mb={12}>
                    {'Currency: '}
                  </Text>{/* @ts-ignore */}
                  <Select // @ts-ignore
                    defaultValue={currencyOptions[0]}
                    options={currencyOptions}
                    // value={values.currency}
                    value={currencyOptions ? currencyOptions.find(option => option.value === values.currency) : ''}
                    onChange={(option) => setFieldValue('currency', option.value)}
                  />
                  <Button
                    mt={24}
                    m={0}
                    disabled={touched.amount && errors.amount || errors.currency}
                    onPress={handleSubmit}
                  >
                    CREATE INVOICE
                  </Button>
                </>
              )}
            </Formik>
          </Box>
        </Row>
      </Section>
      <Box flex={1} />
    </Layout>
  );
};

export async function getStaticProps() {
  let zecPrice;
  const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=zcash&vs_currencies=usd');
  const json = await res.json();
  const invoiceId = nanoid();

  const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const nanoidToken = customAlphabet(alphabet, 24);
  const token = nanoidToken() //=> "jc5UZ7GYQy4137plXDXykXDI"

  try {
    zecPrice = json.zcash.usd;
  } catch(err) {}

  return {
    props: {
      zecPrice,
      invoiceId,
      token,
    },
  };
}

export default Checkout;

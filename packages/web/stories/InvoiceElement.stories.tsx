import { InvoiceElement } from '@elemental-pay/components';
import { Box } from 'elemental-react';

export default {
  component: InvoiceElement,
  title: 'Components/InvoiceElement',
  tags: ['autodocs'],
  decorators: [(Story) => (
    <Box p={40} bg="#efefef">
      <Box bg="white" p={40}>
        <Story />
      </Box>
    </Box>
  )]
}

const WalletButtonContainer = ({ href, children, ...props }) => (
  <a href={href} style={{ display: 'flex', flex: 1 }} {...props}>
    {children}
  </a>
)

const zAddress = 'u17cfedft692aczpny0yk498057jq8chdu4lsme6ucd5j0np479983rrwprl3usnhn0580gdqmckrftr0ge3mt5dts6jfer66sqyhgy4cltz2zhq0mm73s24cypsvctr0e6mzx3wkv72nayhkjrfqt8ka0yemrwuyaxrm03l63rydamxch';

export const Default = {
  args: {
    currency: 'ZEC',
    amount: 0.01,
    address: zAddress,
    memo: 'Sent with Elemental Pay',
    onCopyPress: () => {},
    components: {
      WalletButtonContainer: (props) => <WalletButtonContainer href={`zcash:${zAddress}?amount=${0.01}&memo=${'123'}`} {...props} />
    },
  },
};
{/* <InvoiceElement
  currency="ZEC"
  amount={Number(zecAmount)}
  address={String(zaddress)}
  memo={String(memo)}
  onCopyPress={async () => {
    if (!zaddress) {
      return;
    }
    await copyTextToClipboard(`zcash:${zaddress}?amount=${zecAmount}&memo=${memo}`);
  }}
  // currency=
  components={{
    WalletButtonContainer: (props) => <WalletButtonContainer href={`zcash:${zaddress}?amount=${zecAmount}&memo=${memo}`} {...props} />
  }}
/> */}
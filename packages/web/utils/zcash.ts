import { fromBase64, toBase64 } from './string';

export const encodeMemo = (memo) =>
  toBase64(unescape(encodeURIComponent(memo))).replace('=', '');

export const decodeMemo = (encodedMemo) => {
  if (!encodedMemo) {
    return '';
  }
  return fromBase64(`${encodedMemo}=`);
}

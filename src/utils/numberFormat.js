import { default as underscoreNumberFormat } from 'underscore.string/numberFormat';

const isNumber = (value) => typeof value === 'number' && isFinite(value);

const numberFormat = (number, decimals = 2) => {
  let formattedNumber = Number(number);
  if (isNaN(formattedNumber)) return 0;
  if (!isNumber(formattedNumber)) return number;
  const floorNum = 10 ** decimals;
  formattedNumber = Math.floor(formattedNumber * floorNum) / floorNum;

  return underscoreNumberFormat(formattedNumber, decimals);
};

export default numberFormat;

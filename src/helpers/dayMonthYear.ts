import { BigInt, ethereum } from "@graphprotocol/graph-ts/index";
import { oneBI, oneDay, zeroBI } from "./constants";
import { toBigInt } from "./typeConverter";

class DayMonthYear {
  day: BigInt;
  month: BigInt;
  year: BigInt;

  constructor(day: BigInt, month: BigInt, year: BigInt) {
    this.day = day;
    this.month = month;
    this.year = year;
  }
}

// Ported from http://howardhinnant.github.io/date_algorithms.html#civil_from_days
export function dayMonthYearFromEventTimestamp(
  block: ethereum.Block
): DayMonthYear {
  let unixEpoch: BigInt = block.timestamp;

  // you can have leap seconds apparently - but this is good enough for us ;)
  let daysSinceEpochStart = unixEpoch / oneDay();
  daysSinceEpochStart = daysSinceEpochStart + toBigInt(719468);

  let era: BigInt =
    (daysSinceEpochStart >= zeroBI()
      ? daysSinceEpochStart
      : daysSinceEpochStart - toBigInt(146096)) / toBigInt(146097);
  let dayOfEra: BigInt = daysSinceEpochStart - era * toBigInt(146097); // [0, 146096]
  let yearOfEra: BigInt =
    (dayOfEra -
      dayOfEra / toBigInt(1460) +
      dayOfEra / toBigInt(36524) -
      dayOfEra / toBigInt(146096)) /
    toBigInt(365); // [0, 399]

  let year: BigInt = yearOfEra + era * toBigInt(400);
  let dayOfYear: BigInt =
    dayOfEra -
    (toBigInt(365) * yearOfEra +
      yearOfEra / toBigInt(4) -
      yearOfEra / toBigInt(100)); // [0, 365]
  let monthZeroIndexed =
    (toBigInt(5) * dayOfYear + toBigInt(2)) / toBigInt(153); // [0, 11]
  let day =
    dayOfYear -
    (toBigInt(153) * monthZeroIndexed + toBigInt(2)) / toBigInt(5) +
    toBigInt(1); // [1, 31]
  let month =
    monthZeroIndexed +
    (monthZeroIndexed < toBigInt(10) ? toBigInt(3) : toBigInt(-9)); // [1, 12]

  year = month <= toBigInt(2) ? year + oneBI() : year;

  return new DayMonthYear(day, month, year);
}

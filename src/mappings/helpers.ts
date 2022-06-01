import { BigInt } from '@graphprotocol/graph-ts'

export const SECONDS_PER_DAY = 86400

export let BI_MINUS_1 = BigInt.fromI32(-1)
export let BI_0 = BigInt.fromI32(0)
export let BI_1 = BigInt.fromI32(1)

export function concatFiltered(arr1: string[], arr2: string[]): string[] {
  let array = arr1.concat(arr2)

  return array.filter((item, index, array) => array.indexOf(item) === index)
}

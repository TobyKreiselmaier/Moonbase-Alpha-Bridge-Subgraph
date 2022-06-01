import { Address, BigInt } from '@graphprotocol/graph-ts'
import { Bridge } from '../../generated/Bridge/Bridge'
import { BRIDGE } from './config'

export const SECONDS_PER_DAY = 86400

export let BI_MINUS_1 = BigInt.fromI32(-1)
export let BI_0 = BigInt.fromI32(0)
export let BI_1 = BigInt.fromI32(1)

export function getRelayerThreshold(): BigInt {
  let contract = Bridge.bind(Address.fromString(BRIDGE))
  let threshold = BI_0

  let result = contract.try__relayerThreshold()
  if (!result.reverted) {
    threshold = result.value
  }

  return threshold
}

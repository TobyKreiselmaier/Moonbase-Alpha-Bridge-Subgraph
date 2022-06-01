import { BigDecimal, BigInt } from '@graphprotocol/graph-ts'

// randomly created test addresses
export const ADDRESS_1 = '0x8c47e52a34dd3e5d538d42112c0c0029676921f1'
export const ADDRESS_2 = '0x6580b72e1a7bef9322b9af1f27f73195542fd83f'
export const ADDRESS_3 = '0xede74cee21cb0e0eab0765380f73a1828ca92f5c'
export const mockHash = '0xa16081f360e3847006db660bae1c6d1b2e17ec2a' // Matchstick hash for first tx / block

// random BI values
export let BI_0 = BigInt.fromI32(0)
export let BI_1 = BigInt.fromI32(1)
export const TIMESTAMP = BigInt.fromI32(1622140384)
export const BLOCK_NUMBER = BigInt.fromI32(8660310)

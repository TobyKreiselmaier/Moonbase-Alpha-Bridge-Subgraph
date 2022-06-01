import { BigDecimal, BigInt } from '@graphprotocol/graph-ts'

// randomly created test addresses
export const ADDRESS_1 = '0x8c47e52a34dd3e5d538d42112c0c0029676921f1'
export const ADDRESS_2 = '0x6580b72e1a7bef9322b9af1f27f73195542fd83f'
export const ADDRESS_3 = '0xede74cee21cb0e0eab0765380f73a1828ca92f5c'
export const ADDRESS_4 = '0x27eed0a8f413d8a85d17a1082df81cd9115144c8'
export const ADDRESS_5 = '0xfbcb61686b70658bcec48ca176d0faaa891ec09a'
export const ADDRESS_6 = '0x225c86542ae58ba8ba3d56531f2bb294b60d071f'
export const ADDRESS_7 = '0x0e0ae97780dd94710403f43edf6a183f2d7d8631'
export const ADDRESS_8 = '0xf8aeeef029006de732cb3fab52b5e2c366c47831'
export const ADDRESS_9 = '0x830cd08fe24d6bc9151825732c8c98bc4b435f22'
export const ADDRESS_10 = '0x4437cc7378eee0c811bd3fe50fb3b00b5f9f1201'
export const ADDRESS_11 = '0xd67257c923ea4ae93acb3f7b210951e6a7c1a38c'
export const ADDRESS_12 = '0x770a2192455ef9d608f35f88e81c88d8035beff2'
export const ADDRESS_13 = '0x2b0a7b7760668747385ff0547f9e25a56a55793d'
export const ADDRESS_14 = '0xb34d250cca45015a4fdb4301ac1aad7a287223ec'
export const ADDRESS_15 = '0x485f0fde9a9bd1cc64c40c2a61cb1811e45574ba'
export const ADDRESS_16 = '0x01652f401ccf8a2e34276aad6f222f4747090718'
export const ADDRESS_17 = '0x42b45733f172bb1c2a8a5b63fa9f618cfc2b2aa2'
export const ADDRESS_18 = '0x61d8085e6ccc57a95d83e4b572a62e3913caf4e6'
export const ADDRESS_19 = '0x6146efb331972e1030ab459bc6fff450038be869'
export const ADDRESS_20 = '0x73091c9f98692ae270a84c60d91d7145fcfaef38'
export const txHash = '0x6d0aefb95541db5268047adf20a661aafc09f80a77445f76a72769dfef9d04c1'
export const blockHash = '0x76d9bc33d03ab9dfa3f5582c3544cbbc0dca966990375ae97522ad3ebe53f04a'
export const mockHash = '0xa16081f360e3847006db660bae1c6d1b2e17ec2a' // Matchstick hash for first tx / block

// random BI values
export let BI_0 = BigInt.fromI32(0)
export let BI_1 = BigInt.fromI32(1)
export let BI_SMALL_TEST_VALUE = BigInt.fromI32(18957) // use e.g. for date
export let BI_MEDIUM_TEST_VALUE = BigInt.fromI32(987654) // use e.g. for block number
export let BI_LARGE_TEST_VALUE = BigInt.fromI32(1640000000) // use e.g. for Unix timestamp

// random BD values
export let BD_0 = BigDecimal.fromString('0')
export let BD_SMALL_TEST_AMOUNT = BigDecimal.fromString('1.234')
export let BD_MEDIUM_TEST_AMOUNT = BigDecimal.fromString('121.78')
export let BD_LARGE_TEST_AMOUNT = BigDecimal.fromString('177777.456')

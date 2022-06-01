import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts'
import { afterEach, assert, clearStore, describe, newMockEvent, test } from 'matchstick-as'
import { ReferralProgram, Referee, Referrer, DailyReferralStatistic } from '../generated/schema' // entities
import { Referral } from '../generated/ReferralGovernedProxy/ReferralGovernedProxy' // event
import { handleReferral } from '../src/mappings/referral' // event handler
import {
  ADDRESS_1,
  ADDRESS_10,
  ADDRESS_2,
  ADDRESS_3,
  ADDRESS_4,
  ADDRESS_5,
  ADDRESS_6,
  ADDRESS_7,
  ADDRESS_8,
  ADDRESS_9,
  BI_0,
  BI_1,
  BI_LARGE_TEST_VALUE,
  BI_MEDIUM_TEST_VALUE,
  BI_SMALL_TEST_VALUE,
  mockHash,
  txHash
} from './testvalues'

// used to create a new `Referral` test event
export function createReferralEvent(referrer: string, referee: string): Referral {
  let newReferralEvent = changetype<Referral>(newMockEvent())
  newReferralEvent.parameters = new Array()
  let referrerParam = new ethereum.EventParam(
    '_referrer',
    ethereum.Value.fromAddress(Address.fromString(referrer))
  )
  let refereeParam = new ethereum.EventParam(
    'referee',
    ethereum.Value.fromAddress(Address.fromString(referee))
  )

  newReferralEvent.parameters.push(referrerParam)
  newReferralEvent.parameters.push(refereeParam)

  return newReferralEvent
}

// used to handle `Referral` test events
export function handleNewReferralEvents(events: Referral[]): void {
  events.forEach((event) => {
    handleReferral(event)
  })
}

describe('handleReferral()', () => {
  describe('ReferralProgram entity', () => {
    test('a manually created entity has correct fields', () => {
      // Initialize a test ReferralProgram entity
      let referralProgram = new ReferralProgram('1')
      referralProgram.subgraphVersion = '1.2.0'
      referralProgram.referralsCount = BigInt.fromString('4')
      referralProgram.save()

      // check values for manually created test entity
      assert.fieldEquals('ReferralProgram', '1', 'id', '1')
      assert.fieldEquals('ReferralProgram', '1', 'subgraphVersion', '1.2.0')
      assert.fieldEquals('ReferralProgram', '1', 'referralsCount', '4')
    })

    test('an entity created through a test event has correct fields', () => {
      // create a test ReferralProgram entity via a test event
      let testEvent = createReferralEvent(ADDRESS_3, ADDRESS_4)

      handleNewReferralEvents([testEvent])

      // check values for test entity created via test event and the Referral event handler
      assert.fieldEquals('ReferralProgram', '1', 'id', '1')
      assert.fieldEquals('ReferralProgram', '1', 'subgraphVersion', '1.2.0')
      assert.fieldEquals('ReferralProgram', '1', 'referralsCount', '1')
    })
  })

  describe('Referee entity', () => {
    test('a manually created entity has correct fields', () => {
      // Initialize a test Referee entity
      let referee = new Referee(ADDRESS_1)
      referee.referrer = ADDRESS_2
      referee.save()

      // check values for manually created test entity
      assert.fieldEquals('Referee', ADDRESS_1, 'id', ADDRESS_1)
      assert.fieldEquals('Referee', ADDRESS_1, 'referrer', ADDRESS_2)
    })

    test('an entity created through a test event has correct fields', () => {
      // create test Referee entity via a test event
      let testEvent = createReferralEvent(ADDRESS_3, ADDRESS_4)

      handleNewReferralEvents([testEvent])

      // check values for test entity created via test event and the Referral event handler
      assert.fieldEquals('Referee', ADDRESS_4, 'id', ADDRESS_4)
      assert.fieldEquals('Referee', ADDRESS_4, 'referrer', ADDRESS_3)
    })
  })

  describe('Referrer entity', () => {
    test('a manually created entity has correct fields', () => {
      // Initialize a test Referrer entity
      let referrer = new Referrer(ADDRESS_2)
      referrer.referees_1 = [ADDRESS_1]
      referrer.referees_1_count = BigInt.fromString('1')
      referrer.referees_2 = [ADDRESS_4, ADDRESS_5, ADDRESS_6]
      referrer.referees_2_count = BigInt.fromString('3')
      referrer.referees_3 = [ADDRESS_10, ADDRESS_9, ADDRESS_8, ADDRESS_7]
      referrer.referees_3_count = BigInt.fromString('4')
      referrer.txHash = txHash
      referrer.timestamp = BI_LARGE_TEST_VALUE
      referrer.save()

      // check values for manually created test entity
      assert.fieldEquals('Referrer', ADDRESS_2, 'id', ADDRESS_2)
      assert.fieldEquals('Referrer', ADDRESS_2, 'referees_1', '['.concat(ADDRESS_1).concat(']'))
      assert.fieldEquals('Referrer', ADDRESS_2, 'referees_1_count', '1')
      assert.fieldEquals(
        'Referrer',
        ADDRESS_2,
        'referees_2',
        '['
          .concat(ADDRESS_4)
          .concat(', ')
          .concat(ADDRESS_5)
          .concat(', ')
          .concat(ADDRESS_6)
          .concat(']')
      )
      assert.fieldEquals('Referrer', ADDRESS_2, 'referees_2_count', '3')
      assert.fieldEquals(
        'Referrer',
        ADDRESS_2,
        'referees_3',
        '['
          .concat(ADDRESS_10)
          .concat(', ')
          .concat(ADDRESS_9)
          .concat(', ')
          .concat(ADDRESS_8)
          .concat(', ')
          .concat(ADDRESS_7)
          .concat(']')
      )
      assert.fieldEquals('Referrer', ADDRESS_2, 'referees_3_count', '4')
      assert.fieldEquals('Referrer', ADDRESS_2, 'txHash', txHash)
      assert.fieldEquals('Referrer', ADDRESS_2, 'timestamp', BI_LARGE_TEST_VALUE.toString())
    })

    test('an entity created through a test event has correct fields', () => {
      // create three test events and check if the correct entities are created
      let testEvent1 = createReferralEvent(ADDRESS_4, ADDRESS_3)
      let testEvent2 = createReferralEvent(ADDRESS_5, ADDRESS_4)
      let testEvent3 = createReferralEvent(ADDRESS_6, ADDRESS_5)

      handleNewReferralEvents([testEvent1, testEvent2, testEvent3])

      // check values for test entity created via test event and the Referral event handler
      // ADDRESS_4 is Referrer
      assert.fieldEquals('Referrer', ADDRESS_4, 'id', ADDRESS_4)
      assert.fieldEquals('Referrer', ADDRESS_4, 'referees_1', '['.concat(ADDRESS_3).concat(']'))
      assert.fieldEquals('Referrer', ADDRESS_4, 'referees_1_count', '1')
      assert.fieldEquals('Referrer', ADDRESS_4, 'referees_2', '[]')
      assert.fieldEquals('Referrer', ADDRESS_4, 'referees_2_count', '0')
      assert.fieldEquals('Referrer', ADDRESS_4, 'referees_3', '[]')
      assert.fieldEquals('Referrer', ADDRESS_4, 'referees_3_count', '0')
      assert.fieldEquals('Referrer', ADDRESS_4, 'txHash', mockHash)
      assert.fieldEquals('Referrer', ADDRESS_4, 'timestamp', '1')

      // ADDRESS_5 is Referrer
      assert.fieldEquals('Referrer', ADDRESS_5, 'id', ADDRESS_5)
      assert.fieldEquals('Referrer', ADDRESS_5, 'referees_1', '['.concat(ADDRESS_4).concat(']'))
      assert.fieldEquals('Referrer', ADDRESS_5, 'referees_1_count', '1')
      assert.fieldEquals('Referrer', ADDRESS_5, 'referees_2', '['.concat(ADDRESS_3).concat(']'))
      assert.fieldEquals('Referrer', ADDRESS_5, 'referees_2_count', '1')
      assert.fieldEquals('Referrer', ADDRESS_5, 'referees_3', '[]')
      assert.fieldEquals('Referrer', ADDRESS_5, 'referees_3_count', '0')
      assert.fieldEquals('Referrer', ADDRESS_5, 'txHash', mockHash)
      assert.fieldEquals('Referrer', ADDRESS_5, 'timestamp', '1')

      // ADDRESS_6 is Referrer
      assert.fieldEquals('Referrer', ADDRESS_6, 'id', ADDRESS_6)
      assert.fieldEquals('Referrer', ADDRESS_6, 'referees_1', '['.concat(ADDRESS_5).concat(']'))
      assert.fieldEquals('Referrer', ADDRESS_6, 'referees_1_count', '1')
      assert.fieldEquals('Referrer', ADDRESS_6, 'referees_2', '['.concat(ADDRESS_4).concat(']'))
      assert.fieldEquals('Referrer', ADDRESS_6, 'referees_2_count', '1')
      assert.fieldEquals('Referrer', ADDRESS_6, 'referees_3', '['.concat(ADDRESS_3).concat(']'))
      assert.fieldEquals('Referrer', ADDRESS_6, 'referees_3_count', '1')
      assert.fieldEquals('Referrer', ADDRESS_6, 'txHash', mockHash)
      assert.fieldEquals('Referrer', ADDRESS_6, 'timestamp', '1')
    })
  })

  describe('DailyReferralStatistic entity', () => {
    test('a manually created entity has correct fields', () => {
      // Initialize a test DailyReferralStatistic entity
      let dailyReferralStatistic = new DailyReferralStatistic(
        ADDRESS_10.concat('-').concat(BI_SMALL_TEST_VALUE.toString())
      )
      dailyReferralStatistic.date = BI_LARGE_TEST_VALUE.toI32()
      dailyReferralStatistic.referees_1_count = BigInt.fromI32(5)
      dailyReferralStatistic.referees_2_count = BigInt.fromI32(2)
      dailyReferralStatistic.referees_3_count = BigInt.fromI32(17)
      dailyReferralStatistic.dailyReferralsCount = BigInt.fromI32(2)
      dailyReferralStatistic.save()

      // check values for manually created test entity
      assert.fieldEquals(
        'DailyReferralStatistic',
        ADDRESS_10.concat('-').concat(BI_SMALL_TEST_VALUE.toString()),
        'id',
        ADDRESS_10.concat('-').concat(BI_SMALL_TEST_VALUE.toString())
      )
      assert.fieldEquals(
        'DailyReferralStatistic',
        ADDRESS_10.concat('-').concat(BI_SMALL_TEST_VALUE.toString()),
        'date',
        BI_LARGE_TEST_VALUE.toString()
      )
      assert.fieldEquals(
        'DailyReferralStatistic',
        ADDRESS_10.concat('-').concat(BI_SMALL_TEST_VALUE.toString()),
        'referees_1_count',
        BigInt.fromI32(5).toString()
      )
      assert.fieldEquals(
        'DailyReferralStatistic',
        ADDRESS_10.concat('-').concat(BI_SMALL_TEST_VALUE.toString()),
        'referees_2_count',
        BigInt.fromI32(2).toString()
      )
      assert.fieldEquals(
        'DailyReferralStatistic',
        ADDRESS_10.concat('-').concat(BI_SMALL_TEST_VALUE.toString()),
        'referees_3_count',
        BigInt.fromI32(17).toString()
      )
      assert.fieldEquals(
        'DailyReferralStatistic',
        ADDRESS_10.concat('-').concat(BI_SMALL_TEST_VALUE.toString()),
        'dailyReferralsCount',
        BigInt.fromI32(2).toString()
      )
    })

    test('an entity created through a test event has correct fields', () => {
      // create another test DailyReferralStatistic entity via a test event
      let testEvent = createReferralEvent(ADDRESS_7, ADDRESS_8)

      handleNewReferralEvents([testEvent])

      // check values for test entity created via test event and the Referral event handler
      assert.fieldEquals(
        'DailyReferralStatistic',
        ADDRESS_7.concat('-').concat('0'),
        'id',
        ADDRESS_7.concat('-').concat('0')
      )
      assert.fieldEquals('DailyReferralStatistic', ADDRESS_7.concat('-').concat('0'), 'date', '0')
      assert.fieldEquals(
        'DailyReferralStatistic',
        ADDRESS_7.concat('-').concat('0'),
        'referees_1_count',
        BI_1.toString()
      )
      assert.fieldEquals(
        'DailyReferralStatistic',
        ADDRESS_7.concat('-').concat('0'),
        'referees_2_count',
        BI_0.toString()
      )
      assert.fieldEquals(
        'DailyReferralStatistic',
        ADDRESS_7.concat('-').concat('0'),
        'referees_3_count',
        BI_0.toString()
      )
    })
  })

  afterEach(() => {
    // clean the store so that the next test can start with a fresh store object
    clearStore()
  })
})

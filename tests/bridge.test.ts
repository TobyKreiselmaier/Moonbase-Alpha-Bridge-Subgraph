import { Address, BigInt, Bytes, ethereum } from '@graphprotocol/graph-ts'
import {
  afterEach,
  assert,
  clearStore,
  describe,
  logStore,
  newMockEvent,
  test
} from 'matchstick-as'
import {
  DailyStatistic,
  General,
  Proposal,
  ProposalCount,
  Relayer,
  Role,
  UserDeposit,
  User,
  Vote
} from '../generated/schema' // entities
import {
  Deposit,
  ProposalEvent,
  ProposalVote,
  RelayerAdded,
  RelayerRemoved,
  RelayerThresholdChanged,
  RoleGranted,
  RoleRevoked
} from '../generated/Bridge/Bridge' // events
import {
  handleDeposit,
  handleProposalEvent,
  handleProposalVote,
  handleRelayerAdded,
  handleRelayerRemoved,
  handleRelayerThresholdChanged,
  handleRoleGranted,
  handleRoleRevoked
} from '../src/mappings/core' // event handlers
import {
  CHAIN_ID,
  DEFAULT_ADMIN_ROLE,
  RELAYER_ROLE,
  SUBGRAPH_VERSION
} from '../src/mappings/config'
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

// used to create a new `Deposit` test event
export function createDepositEvent(
  destinationChainID: i32,
  resourceID: Bytes,
  depositNonce: BigInt
): Deposit {
  let newDepositEvent = changetype<Deposit>(newMockEvent())
  newDepositEvent.parameters = new Array()
  let destinationChainIDParam = new ethereum.EventParam(
    'destinationChainID',
    ethereum.Value.fromI32(destinationChainID)
  )
  let resourceIDParam = new ethereum.EventParam(
    'resourceID',
    ethereum.Value.fromFixedBytes(resourceID)
  )
  let depositNonceParam = new ethereum.EventParam(
    'depositNonce',
    ethereum.Value.fromUnsignedBigInt(depositNonce)
  )

  newDepositEvent.parameters.push(destinationChainIDParam)
  newDepositEvent.parameters.push(resourceIDParam)
  newDepositEvent.parameters.push(depositNonceParam)

  return newDepositEvent
}

// used to handle `Deposit` test events
export function handleNewDepositEvents(events: Deposit[]): void {
  events.forEach((event) => {
    handleDeposit(event)
  })
}

// used to create a new `ProposalEvent` test event
export function createProposalEventEvent(
  originChainID: i32,
  depositNonce: BigInt,
  status: i32,
  resourceID: Bytes,
  dataHash: Bytes
): ProposalEvent {
  let newProposalEventEvent = changetype<ProposalEvent>(newMockEvent())
  newProposalEventEvent.parameters = new Array()
  let originChainIDParam = new ethereum.EventParam(
    'originChainID',
    ethereum.Value.fromI32(originChainID)
  )
  let depositNonceParam = new ethereum.EventParam(
    'depositNonce',
    ethereum.Value.fromUnsignedBigInt(depositNonce)
  )
  let statusParam = new ethereum.EventParam('status', ethereum.Value.fromI32(status))
  let resourceIDParam = new ethereum.EventParam(
    'resourceID',
    ethereum.Value.fromFixedBytes(resourceID)
  )
  let dataHashParam = new ethereum.EventParam('dataHash', ethereum.Value.fromFixedBytes(dataHash))

  newProposalEventEvent.parameters.push(originChainIDParam)
  newProposalEventEvent.parameters.push(depositNonceParam)
  newProposalEventEvent.parameters.push(statusParam)
  newProposalEventEvent.parameters.push(resourceIDParam)
  newProposalEventEvent.parameters.push(dataHashParam)

  return newProposalEventEvent
}

// used to handle `ProposalEvent` test events
export function handleNewProposalEventEvents(events: ProposalEvent[]): void {
  events.forEach((event) => {
    handleProposalEvent(event)
  })
}

describe('handleDeposit()', () => {
  describe('General entity', () => {
    test('a manually created entity has correct fields', () => {
      // Initialize a test General entity
      let general = new General('1')
      general.totalDepositsCount = BigInt.fromI32(19)
      general.totalProposalsCount = BigInt.fromI32(25)
      general.totalVotesCount = BigInt.fromI32(14)
      general.totalRelayersCount = BI_1
      general.chainId = CHAIN_ID
      general.subgraphVersion = SUBGRAPH_VERSION
      general.save()

      // check values for manually created test entity
      assert.fieldEquals('General', '1', 'id', '1')
      assert.fieldEquals('General', '1', 'totalDepositsCount', BigInt.fromI32(19).toString())
      assert.fieldEquals('General', '1', 'totalProposalsCount', BigInt.fromI32(25).toString())
      assert.fieldEquals('General', '1', 'totalVotesCount', BigInt.fromI32(14).toString())
      assert.fieldEquals('General', '1', 'totalRelayersCount', BI_1.toString())
      assert.fieldEquals('General', '1', 'chainId', CHAIN_ID.toString())
      assert.fieldEquals('General', '1', 'subgraphVersion', SUBGRAPH_VERSION.toString())
    })

    test('an entity created through a test event has correct fields', () => {
      // create a test General entity via a test event
      let testEvent = createDepositEvent(42, new Bytes(15), BigInt.fromI32(156))

      handleNewDepositEvents([testEvent])

      // check values for test entity created via test event and the Deposit event handler
      assert.fieldEquals('General', '1', 'id', '1')
      assert.fieldEquals('General', '1', 'totalDepositsCount', BI_1.toString())
      assert.fieldEquals('General', '1', 'totalProposalsCount', BI_0.toString())
      assert.fieldEquals('General', '1', 'totalVotesCount', BI_0.toString())
      assert.fieldEquals('General', '1', 'totalRelayersCount', BI_0.toString())
      assert.fieldEquals('General', '1', 'chainId', CHAIN_ID.toString())
      assert.fieldEquals('General', '1', 'subgraphVersion', SUBGRAPH_VERSION.toString())
    })
  })

  describe('UserDeposit entity', () => {
    test('a manually created entity has correct fields', () => {
      // Initialize a test UserDeposit entity
      let userDeposit = new UserDeposit('Test')
      userDeposit.originChainId = CHAIN_ID
      userDeposit.destinationChainId = 17
      userDeposit.resourceId = new Bytes(14)
      userDeposit.nonce = BI_1
      userDeposit.createdTimestamp = BigInt.fromI32(1622140384)
      userDeposit.createdBlockNumber = BigInt.fromI32(8660310)
      userDeposit.save()

      // check values for manually created test entity
      assert.fieldEquals('UserDeposit', 'Test', 'id', 'Test')
      assert.fieldEquals('UserDeposit', 'Test', 'originChainId', CHAIN_ID.toString())
      assert.fieldEquals('UserDeposit', 'Test', 'destinationChainId', '17')
      assert.fieldEquals('UserDeposit', 'Test', 'resourceId', new Bytes(14).toHex())
      assert.fieldEquals('UserDeposit', 'Test', 'nonce', BI_1.toString())
      assert.fieldEquals(
        'UserDeposit',
        'Test',
        'createdTimestamp',
        BigInt.fromI32(1622140384).toString()
      )
      assert.fieldEquals(
        'UserDeposit',
        'Test',
        'createdBlockNumber',
        BigInt.fromI32(8660310).toString()
      )
    })

    test('an entity created through a test event has correct fields', () => {
      // create a test UserDeposit entity via a test event
      let testEvent = createDepositEvent(42, new Bytes(15), BigInt.fromI32(156))

      handleNewDepositEvents([testEvent])

      // check values for test entity created via test event and the Deposit event handler
      assert.fieldEquals('UserDeposit', '4=>42-156', 'id', '4=>42-156')
      assert.fieldEquals('UserDeposit', '4=>42-156', 'originChainId', CHAIN_ID.toString())
      assert.fieldEquals('UserDeposit', '4=>42-156', 'destinationChainId', '42')
      assert.fieldEquals('UserDeposit', '4=>42-156', 'resourceId', new Bytes(15).toHex())
      assert.fieldEquals('UserDeposit', '4=>42-156', 'nonce', BigInt.fromI32(156).toString())
      assert.fieldEquals('UserDeposit', '4=>42-156', 'createdTimestamp', '1')
      assert.fieldEquals('UserDeposit', '4=>42-156', 'createdBlockNumber', '1')
    })
  })

  describe('DailyStatistic entity', () => {
    test('a manually created entity has correct fields', () => {
      // Initialize a test DailyStatistic entity
      let dailyStatistic = new DailyStatistic('Test')
      dailyStatistic.date = 1653091200
      dailyStatistic.depositsCount = BI_1
      dailyStatistic.proposalsCount = BI_0
      dailyStatistic.votesCount = BI_0
      dailyStatistic.relayersCount = BI_0
      dailyStatistic.save()

      // check values for manually created test entity
      assert.fieldEquals('DailyStatistic', 'Test', 'id', 'Test')
      assert.fieldEquals('DailyStatistic', 'Test', 'date', '1653091200')
      assert.fieldEquals('DailyStatistic', 'Test', 'depositsCount', BI_1.toString())
      assert.fieldEquals('DailyStatistic', 'Test', 'proposalsCount', BI_0.toString())
      assert.fieldEquals('DailyStatistic', 'Test', 'votesCount', BI_0.toString())
      assert.fieldEquals('DailyStatistic', 'Test', 'relayersCount', BI_0.toString())
    })

    test('an entity created through a test event has correct fields', () => {
      // create a test UserDeposit entity via a test event
      let testEvent = createDepositEvent(42, new Bytes(15), BigInt.fromI32(156))

      handleNewDepositEvents([testEvent])

      // check values for test entity created via test event and the Deposit event handler
      assert.fieldEquals('DailyStatistic', '0', 'id', '0')
      assert.fieldEquals('DailyStatistic', '0', 'date', '0')
      assert.fieldEquals('DailyStatistic', '0', 'depositsCount', '1')
      assert.fieldEquals('DailyStatistic', '0', 'proposalsCount', '0')
      assert.fieldEquals('DailyStatistic', '0', 'votesCount', '0')
      assert.fieldEquals('DailyStatistic', '0', 'relayersCount', '0')
    })
  })

  afterEach(() => {
    // clean the store so that the next test can start with a fresh store object
    clearStore()
  })
})

describe('handleProposalEvent()', () => {
  describe('General entity', () => {
    test('a manually created entity has correct fields', () => {
      // Initialize a test General entity
      let general = new General('1')
      general.totalDepositsCount = BigInt.fromI32(19)
      general.totalProposalsCount = BigInt.fromI32(25)
      general.totalVotesCount = BigInt.fromI32(14)
      general.totalRelayersCount = BI_1
      general.chainId = CHAIN_ID
      general.subgraphVersion = SUBGRAPH_VERSION
      general.save()

      // check values for manually created test entity
      assert.fieldEquals('General', '1', 'id', '1')
      assert.fieldEquals('General', '1', 'totalDepositsCount', BigInt.fromI32(19).toString())
      assert.fieldEquals('General', '1', 'totalProposalsCount', BigInt.fromI32(25).toString())
      assert.fieldEquals('General', '1', 'totalVotesCount', BigInt.fromI32(14).toString())
      assert.fieldEquals('General', '1', 'totalRelayersCount', BI_1.toString())
      assert.fieldEquals('General', '1', 'chainId', CHAIN_ID.toString())
      assert.fieldEquals('General', '1', 'subgraphVersion', SUBGRAPH_VERSION.toString())
    })

    test('an entity created through a test event has correct fields', () => {
      // create a test General entity via a test event
      let testEvent = createProposalEventEvent(
        4,
        BigInt.fromI32(156),
        3,
        new Bytes(1500),
        new Bytes(2700)
      )

      handleNewProposalEventEvents([testEvent])

      // check values for test entity created via test event and the Deposit event handler
      assert.fieldEquals('General', '1', 'id', '1')
      assert.fieldEquals('General', '1', 'totalDepositsCount', BI_0.toString())
      assert.fieldEquals('General', '1', 'totalProposalsCount', BI_1.toString())
      assert.fieldEquals('General', '1', 'totalVotesCount', BI_0.toString())
      assert.fieldEquals('General', '1', 'totalRelayersCount', BI_0.toString())
      assert.fieldEquals('General', '1', 'chainId', CHAIN_ID.toString())
      assert.fieldEquals('General', '1', 'subgraphVersion', SUBGRAPH_VERSION.toString())
    })
  })

  describe('UserDeposit entity', () => {
    test('a manually created entity has correct fields', () => {
      // Initialize a test UserDeposit entity
      let userDeposit = new UserDeposit('Test')
      userDeposit.originChainId = CHAIN_ID
      userDeposit.destinationChainId = 17
      userDeposit.resourceId = new Bytes(14)
      userDeposit.nonce = BI_1
      userDeposit.createdTimestamp = BigInt.fromI32(1622140384)
      userDeposit.createdBlockNumber = BigInt.fromI32(8660310)
      userDeposit.save()

      // check values for manually created test entity
      assert.fieldEquals('UserDeposit', 'Test', 'id', 'Test')
      assert.fieldEquals('UserDeposit', 'Test', 'originChainId', CHAIN_ID.toString())
      assert.fieldEquals('UserDeposit', 'Test', 'destinationChainId', '17')
      assert.fieldEquals('UserDeposit', 'Test', 'resourceId', new Bytes(14).toHex())
      assert.fieldEquals('UserDeposit', 'Test', 'nonce', BI_1.toString())
      assert.fieldEquals(
        'UserDeposit',
        'Test',
        'createdTimestamp',
        BigInt.fromI32(1622140384).toString()
      )
      assert.fieldEquals(
        'UserDeposit',
        'Test',
        'createdBlockNumber',
        BigInt.fromI32(8660310).toString()
      )
    })

    test('an entity created through a test event has correct fields', () => {
      // create a test UserDeposit entity via a test event
      let testEvent = createProposalEventEvent(
        42,
        BigInt.fromI32(156),
        3,
        new Bytes(1500),
        new Bytes(2700)
      )

      handleNewProposalEventEvents([testEvent])

      // check values for test entity created via test event and the Deposit event handler
      assert.fieldEquals('UserDeposit', '42=>4-156', 'id', '42=>4-156')
      assert.fieldEquals('UserDeposit', '42=>4-156', 'originChainId', '42')
      assert.fieldEquals('UserDeposit', '42=>4-156', 'destinationChainId', CHAIN_ID.toString())
      assert.fieldEquals('UserDeposit', '42=>4-156', 'resourceId', new Bytes(1500).toHex())
      assert.fieldEquals('UserDeposit', '42=>4-156', 'nonce', BigInt.fromI32(156).toString())
      assert.fieldEquals('UserDeposit', '42=>4-156', 'createdTimestamp', '1')
      assert.fieldEquals('UserDeposit', '42=>4-156', 'createdBlockNumber', '1')
    })
  })

  describe('Proposal entity', () => {
    test('a manually created entity has correct fields', () => {
      // Initialize a test Proposal entity
      let userDeposit = new UserDeposit('Test')
      userDeposit.originChainId = CHAIN_ID
      userDeposit.destinationChainId = 17
      userDeposit.resourceId = new Bytes(14)
      userDeposit.nonce = BI_1
      userDeposit.createdTimestamp = BigInt.fromI32(1622140384)
      userDeposit.createdBlockNumber = BigInt.fromI32(8660310)
      userDeposit.save()

      // check values for manually created test entity
      assert.fieldEquals('UserDeposit', 'Test', 'id', 'Test')
      assert.fieldEquals('UserDeposit', 'Test', 'originChainId', CHAIN_ID.toString())
      assert.fieldEquals('UserDeposit', 'Test', 'destinationChainId', '17')
      assert.fieldEquals('UserDeposit', 'Test', 'resourceId', new Bytes(14).toHex())
      assert.fieldEquals('UserDeposit', 'Test', 'nonce', BI_1.toString())
      assert.fieldEquals(
        'UserDeposit',
        'Test',
        'createdTimestamp',
        BigInt.fromI32(1622140384).toString()
      )
      assert.fieldEquals(
        'UserDeposit',
        'Test',
        'createdBlockNumber',
        BigInt.fromI32(8660310).toString()
      )
    })

    test('an entity created through a test event has correct fields', () => {
      // create a test UserDeposit entity via a test event
      let testEvent = createProposalEventEvent(
        42,
        BigInt.fromI32(156),
        3,
        new Bytes(1500),
        new Bytes(2700)
      )

      handleNewProposalEventEvents([testEvent])

      // check values for test entity created via test event and the Deposit event handler
      assert.fieldEquals('UserDeposit', '42=>4-156', 'id', '42=>4-156')
      assert.fieldEquals('UserDeposit', '42=>4-156', 'originChainId', '42')
      assert.fieldEquals('UserDeposit', '42=>4-156', 'destinationChainId', CHAIN_ID.toString())
      assert.fieldEquals('UserDeposit', '42=>4-156', 'resourceId', new Bytes(1500).toHex())
      assert.fieldEquals('UserDeposit', '42=>4-156', 'nonce', BigInt.fromI32(156).toString())
      assert.fieldEquals('UserDeposit', '42=>4-156', 'createdTimestamp', '1')
      assert.fieldEquals('UserDeposit', '42=>4-156', 'createdBlockNumber', '1')
    })
  })

  describe('ProposalCount entity', () => {
    test('a manually created entity has correct fields', () => {
      // Initialize a test UserDeposit entity
      let userDeposit = new UserDeposit('Test')
      userDeposit.originChainId = CHAIN_ID
      userDeposit.destinationChainId = 17
      userDeposit.resourceId = new Bytes(14)
      userDeposit.nonce = BI_1
      userDeposit.createdTimestamp = BigInt.fromI32(1622140384)
      userDeposit.createdBlockNumber = BigInt.fromI32(8660310)
      userDeposit.save()

      // check values for manually created test entity
      assert.fieldEquals('UserDeposit', 'Test', 'id', 'Test')
      assert.fieldEquals('UserDeposit', 'Test', 'originChainId', CHAIN_ID.toString())
      assert.fieldEquals('UserDeposit', 'Test', 'destinationChainId', '17')
      assert.fieldEquals('UserDeposit', 'Test', 'resourceId', new Bytes(14).toHex())
      assert.fieldEquals('UserDeposit', 'Test', 'nonce', BI_1.toString())
      assert.fieldEquals(
        'UserDeposit',
        'Test',
        'createdTimestamp',
        BigInt.fromI32(1622140384).toString()
      )
      assert.fieldEquals(
        'UserDeposit',
        'Test',
        'createdBlockNumber',
        BigInt.fromI32(8660310).toString()
      )
    })

    test('an entity created through a test event has correct fields', () => {
      // create a test UserDeposit entity via a test event
      let testEvent = createProposalEventEvent(
        42,
        BigInt.fromI32(156),
        3,
        new Bytes(1500),
        new Bytes(2700)
      )

      handleNewProposalEventEvents([testEvent])

      // check values for test entity created via test event and the Deposit event handler
      assert.fieldEquals('UserDeposit', '42=>4-156', 'id', '42=>4-156')
      assert.fieldEquals('UserDeposit', '42=>4-156', 'originChainId', '42')
      assert.fieldEquals('UserDeposit', '42=>4-156', 'destinationChainId', CHAIN_ID.toString())
      assert.fieldEquals('UserDeposit', '42=>4-156', 'resourceId', new Bytes(1500).toHex())
      assert.fieldEquals('UserDeposit', '42=>4-156', 'nonce', BigInt.fromI32(156).toString())
      assert.fieldEquals('UserDeposit', '42=>4-156', 'createdTimestamp', '1')
      assert.fieldEquals('UserDeposit', '42=>4-156', 'createdBlockNumber', '1')
    })
  })

  describe('DailyStatistic entity', () => {
    test('a manually created entity has correct fields', () => {
      // Initialize a test DailyStatistic entity
      let dailyStatistic = new DailyStatistic('Test')
      dailyStatistic.date = 1653091200
      dailyStatistic.depositsCount = BI_1
      dailyStatistic.proposalsCount = BI_0
      dailyStatistic.votesCount = BI_0
      dailyStatistic.relayersCount = BI_0
      dailyStatistic.save()

      // check values for manually created test entity
      assert.fieldEquals('DailyStatistic', 'Test', 'id', 'Test')
      assert.fieldEquals('DailyStatistic', 'Test', 'date', '1653091200')
      assert.fieldEquals('DailyStatistic', 'Test', 'depositsCount', BI_1.toString())
      assert.fieldEquals('DailyStatistic', 'Test', 'proposalsCount', BI_0.toString())
      assert.fieldEquals('DailyStatistic', 'Test', 'votesCount', BI_0.toString())
      assert.fieldEquals('DailyStatistic', 'Test', 'relayersCount', BI_0.toString())
    })

    test('an entity created through a test event has correct fields', () => {
      // create a test UserDeposit entity via a test event
      let testEvent = createProposalEventEvent(
        42,
        BigInt.fromI32(156),
        3,
        new Bytes(1500),
        new Bytes(2700)
      )

      handleNewProposalEventEvents([testEvent])

      // check values for test entity created via test event and the Deposit event handler
      assert.fieldEquals('DailyStatistic', '0', 'id', '0')
      assert.fieldEquals('DailyStatistic', '0', 'date', '0')
      assert.fieldEquals('DailyStatistic', '0', 'depositsCount', '0')
      assert.fieldEquals('DailyStatistic', '0', 'proposalsCount', '1')
      assert.fieldEquals('DailyStatistic', '0', 'votesCount', '0')
      assert.fieldEquals('DailyStatistic', '0', 'relayersCount', '0')
    })
  })

  afterEach(() => {
    // clean the store so that the next test can start with a fresh store object
    clearStore()
  })
})

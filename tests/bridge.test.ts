import { Address, BigInt, Bytes, ethereum } from '@graphprotocol/graph-ts'
import {
  afterEach,
  assert,
  clearStore,
  createMockedFunction,
  describe,
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
import { BRIDGE, CHAIN_ID, RELAYER_ROLE, SUBGRAPH_VERSION } from '../src/mappings/config'
import {
  ADDRESS_1,
  ADDRESS_2,
  ADDRESS_3,
  BI_0,
  BI_1,
  BLOCK_NUMBER,
  mockHash,
  TIMESTAMP
} from './testvalues'
import {
  createDepositEvent,
  createProposalEventEvent,
  createProposalVoteEvent,
  createRelayerAddedEvent,
  createRelayerRemovedEvent,
  createRelayerThresholdChangedEvent,
  createRoleGrantedEvent,
  createRoleRevokedEvent,
  handleNewDepositEvents,
  handleNewProposalEventEvents,
  handleNewProposalVoteEvents,
  handleNewRelayerAddedEvents,
  handleNewRelayerRemovedEvents,
  handleNewRelayerThresholdChangedEvents,
  handleNewRoleGrantedEvents,
  handleNewRoleRevokedEvents
} from './utils'

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
      userDeposit.createdTimestamp = TIMESTAMP
      userDeposit.createdBlockNumber = BLOCK_NUMBER
      userDeposit.save()

      // check values for manually created test entity
      assert.fieldEquals('UserDeposit', 'Test', 'id', 'Test')
      assert.fieldEquals('UserDeposit', 'Test', 'originChainId', CHAIN_ID.toString())
      assert.fieldEquals('UserDeposit', 'Test', 'destinationChainId', '17')
      assert.fieldEquals('UserDeposit', 'Test', 'resourceId', new Bytes(14).toHex())
      assert.fieldEquals('UserDeposit', 'Test', 'nonce', BI_1.toString())
      assert.fieldEquals('UserDeposit', 'Test', 'createdTimestamp', TIMESTAMP.toString())
      assert.fieldEquals('UserDeposit', 'Test', 'createdBlockNumber', BLOCK_NUMBER.toString())
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
      userDeposit.createdTimestamp = TIMESTAMP
      userDeposit.createdBlockNumber = BLOCK_NUMBER
      userDeposit.save()

      // check values for manually created test entity
      assert.fieldEquals('UserDeposit', 'Test', 'id', 'Test')
      assert.fieldEquals('UserDeposit', 'Test', 'originChainId', CHAIN_ID.toString())
      assert.fieldEquals('UserDeposit', 'Test', 'destinationChainId', '17')
      assert.fieldEquals('UserDeposit', 'Test', 'resourceId', new Bytes(14).toHex())
      assert.fieldEquals('UserDeposit', 'Test', 'nonce', BI_1.toString())
      assert.fieldEquals('UserDeposit', 'Test', 'createdTimestamp', TIMESTAMP.toString())
      assert.fieldEquals('UserDeposit', 'Test', 'createdBlockNumber', BLOCK_NUMBER.toString())
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
      let proposal = new Proposal('Test')
      proposal.originChainId = 42
      proposal.destinationChainId = CHAIN_ID
      proposal.resourceId = new Bytes(1500)
      proposal.status = 'executed'
      proposal.dataHash = new Bytes(2700)
      proposal.createdBy = ADDRESS_1
      proposal.passedBy = ADDRESS_2
      proposal.executedBy = ADDRESS_3
      proposal.canceledBy = ''
      proposal.createdTimestamp = BigInt.fromI32(1622138493)
      proposal.createdBlockNumber = BigInt.fromI32(8660184)
      proposal.passedTimestamp = BigInt.fromI32(1622138593)
      proposal.passedBlockNumber = BigInt.fromI32(8660284)
      proposal.executedTimestamp = BigInt.fromI32(1622138693)
      proposal.executedBlockNumber = BigInt.fromI32(8660384)
      proposal.canceledTimestamp = BI_0
      proposal.canceledBlockNumber = BI_0
      proposal.save()

      // check values for manually created test entity
      assert.fieldEquals('Proposal', 'Test', 'id', 'Test')
      assert.fieldEquals('Proposal', 'Test', 'originChainId', '42')
      assert.fieldEquals('Proposal', 'Test', 'destinationChainId', CHAIN_ID.toString())
      assert.fieldEquals('Proposal', 'Test', 'resourceId', new Bytes(1500).toHex())
      assert.fieldEquals('Proposal', 'Test', 'status', 'executed')
      assert.fieldEquals('Proposal', 'Test', 'dataHash', new Bytes(2700).toHex())
      assert.fieldEquals('Proposal', 'Test', 'createdBy', ADDRESS_1)
      assert.fieldEquals('Proposal', 'Test', 'passedBy', ADDRESS_2)
      assert.fieldEquals('Proposal', 'Test', 'executedBy', ADDRESS_3)
      assert.fieldEquals('Proposal', 'Test', 'canceledBy', 'null')
      assert.fieldEquals(
        'Proposal',
        'Test',
        'createdTimestamp',
        BigInt.fromI32(1622138493).toString()
      )
      assert.fieldEquals(
        'Proposal',
        'Test',
        'createdBlockNumber',
        BigInt.fromI32(8660184).toString()
      )
      assert.fieldEquals(
        'Proposal',
        'Test',
        'passedTimestamp',
        BigInt.fromI32(1622138593).toString()
      )
      assert.fieldEquals(
        'Proposal',
        'Test',
        'passedBlockNumber',
        BigInt.fromI32(8660284).toString()
      )
      assert.fieldEquals(
        'Proposal',
        'Test',
        'executedTimestamp',
        BigInt.fromI32(1622138693).toString()
      )
      assert.fieldEquals(
        'Proposal',
        'Test',
        'executedBlockNumber',
        BigInt.fromI32(8660384).toString()
      )
      assert.fieldEquals('Proposal', 'Test', 'canceledTimestamp', BI_0.toString())
      assert.fieldEquals('Proposal', 'Test', 'canceledBlockNumber', BI_0.toString())
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
      assert.fieldEquals('Proposal', '42=>4-156', 'id', '42=>4-156')
      assert.fieldEquals('Proposal', '42=>4-156', 'originChainId', '42')
      assert.fieldEquals('Proposal', '42=>4-156', 'destinationChainId', CHAIN_ID.toString())
      assert.fieldEquals('Proposal', '42=>4-156', 'resourceId', new Bytes(1500).toHex())
      assert.fieldEquals('Proposal', '42=>4-156', 'status', 'executed')
      assert.fieldEquals('Proposal', '42=>4-156', 'dataHash', new Bytes(2700).toHex())
      assert.fieldEquals('Proposal', '42=>4-156', 'createdBy', mockHash)
      assert.fieldEquals('Proposal', '42=>4-156', 'passedBy', 'null')
      assert.fieldEquals('Proposal', '42=>4-156', 'executedBy', mockHash)
      assert.fieldEquals('Proposal', '42=>4-156', 'canceledBy', 'null')
      assert.fieldEquals('Proposal', '42=>4-156', 'createdTimestamp', '1')
      assert.fieldEquals('Proposal', '42=>4-156', 'createdBlockNumber', '1')
      assert.fieldEquals('Proposal', '42=>4-156', 'passedTimestamp', '0')
      assert.fieldEquals('Proposal', '42=>4-156', 'passedBlockNumber', '0')
      assert.fieldEquals('Proposal', '42=>4-156', 'executedTimestamp', '1')
      assert.fieldEquals('Proposal', '42=>4-156', 'executedBlockNumber', '1')
      assert.fieldEquals('Proposal', '42=>4-156', 'canceledTimestamp', BI_0.toString())
      assert.fieldEquals('Proposal', '42=>4-156', 'canceledBlockNumber', BI_0.toString())
    })
  })

  describe('ProposalCount entity', () => {
    test('a manually created entity has correct fields', () => {
      // Initialize a test ProposalCount entity
      let proposalCount = new ProposalCount('Test')
      proposalCount.originChainId = 17
      proposalCount.destinationChainId = CHAIN_ID
      proposalCount.count = BI_1
      proposalCount.timestamp = TIMESTAMP
      proposalCount.blockNumber = BLOCK_NUMBER
      proposalCount.save()

      // check values for manually created test entity
      assert.fieldEquals('ProposalCount', 'Test', 'id', 'Test')
      assert.fieldEquals('ProposalCount', 'Test', 'originChainId', '17')
      assert.fieldEquals('ProposalCount', 'Test', 'destinationChainId', CHAIN_ID.toString())
      assert.fieldEquals('ProposalCount', 'Test', 'count', '1')
      assert.fieldEquals('ProposalCount', 'Test', 'timestamp', TIMESTAMP.toString())
      assert.fieldEquals('ProposalCount', 'Test', 'blockNumber', BLOCK_NUMBER.toString())
    })

    test('an entity created through a test event has correct fields', () => {
      // create a test ProposalCount entity via a test event
      let testEvent = createProposalEventEvent(
        42,
        BigInt.fromI32(156),
        3,
        new Bytes(1500),
        new Bytes(2700)
      )

      handleNewProposalEventEvents([testEvent])

      // check values for test entity created via test event and the Deposit event handler
      assert.fieldEquals('ProposalCount', '42=>4', 'id', '42=>4')
      assert.fieldEquals('ProposalCount', '42=>4', 'originChainId', '42')
      assert.fieldEquals('ProposalCount', '42=>4', 'destinationChainId', CHAIN_ID.toString())
      assert.fieldEquals('ProposalCount', '42=>4', 'count', '1')
      assert.fieldEquals('ProposalCount', '42=>4', 'timestamp', '1')
      assert.fieldEquals('ProposalCount', '42=>4', 'blockNumber', '1')
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
      // create a test DailyStatistic entity via a test event
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

describe('handleProposalVote()', () => {
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
      // create a mock Relayer entity needed for this handler
      let relayer = new Relayer(ADDRESS_1)
      relayer.addedTimestamp = TIMESTAMP
      relayer.addedBlockNumber = BLOCK_NUMBER
      relayer.removedTimestamp = BI_0
      relayer.removedBlockNumber = BI_0
      relayer.voteCount = BI_0
      relayer.threshold = BI_1
      relayer.timestamp = TIMESTAMP
      relayer.blockNumber = BLOCK_NUMBER
      relayer.save()

      // create a test General entity via a test event
      let testEvent = createProposalVoteEvent(4, BigInt.fromI32(156), 3, new Bytes(1500))

      // set the mock relayer as the tx sender
      testEvent.transaction.from = Address.fromString(ADDRESS_1)

      handleNewProposalVoteEvents([testEvent])

      // check values for test entity created via test event and the Deposit event handler
      assert.fieldEquals('General', '1', 'id', '1')
      assert.fieldEquals('General', '1', 'totalDepositsCount', BI_0.toString())
      assert.fieldEquals('General', '1', 'totalProposalsCount', BI_0.toString())
      assert.fieldEquals('General', '1', 'totalVotesCount', BI_1.toString())
      assert.fieldEquals('General', '1', 'totalRelayersCount', BI_0.toString())
      assert.fieldEquals('General', '1', 'chainId', CHAIN_ID.toString())
      assert.fieldEquals('General', '1', 'subgraphVersion', SUBGRAPH_VERSION.toString())
    })
  })

  describe('Vote entity', () => {
    test('a manually created entity has correct fields', () => {
      // Initialize a test Vote entity
      let vote = new Vote('Test')
      vote.relayer = ADDRESS_1
      vote.proposal = 'TestProposalID'
      vote.approved = true
      vote.votedTimestamp = TIMESTAMP
      vote.votedBlockNumber = BLOCK_NUMBER
      vote.save()

      // check values for manually created test entity
      assert.fieldEquals('Vote', 'Test', 'id', 'Test')
      assert.fieldEquals('Vote', 'Test', 'relayer', ADDRESS_1)
      assert.fieldEquals('Vote', 'Test', 'proposal', 'TestProposalID')
      assert.fieldEquals('Vote', 'Test', 'approved', 'true')
      assert.fieldEquals('Vote', 'Test', 'votedTimestamp', TIMESTAMP.toString())
      assert.fieldEquals('Vote', 'Test', 'votedBlockNumber', BLOCK_NUMBER.toString())
    })

    test('an entity created through a test event has correct fields', () => {
      // create a mock Relayer entity needed for this handler
      let relayer = new Relayer(ADDRESS_1)
      relayer.addedTimestamp = TIMESTAMP
      relayer.addedBlockNumber = BLOCK_NUMBER
      relayer.removedTimestamp = BI_0
      relayer.removedBlockNumber = BI_0
      relayer.voteCount = BI_0
      relayer.threshold = BI_1
      relayer.timestamp = TIMESTAMP
      relayer.blockNumber = BLOCK_NUMBER
      relayer.save()

      // create a test General entity via a test event
      let testEvent = createProposalVoteEvent(7, BigInt.fromI32(156), 3, new Bytes(1500))

      // set the mock relayer as the tx sender
      testEvent.transaction.from = Address.fromString(ADDRESS_1)

      handleNewProposalVoteEvents([testEvent])

      // check values for test entity created via test event and the Deposit event handler
      assert.fieldEquals(
        'Vote',
        '7=>4-156-0x8c47e52a34dd3e5d538d42112c0c0029676921f1',
        'id',
        '7=>4-156-0x8c47e52a34dd3e5d538d42112c0c0029676921f1'
      )
      assert.fieldEquals(
        'Vote',
        '7=>4-156-0x8c47e52a34dd3e5d538d42112c0c0029676921f1',
        'relayer',
        ADDRESS_1
      )
      assert.fieldEquals(
        'Vote',
        '7=>4-156-0x8c47e52a34dd3e5d538d42112c0c0029676921f1',
        'proposal',
        '7=>4-156'
      )
      assert.fieldEquals(
        'Vote',
        '7=>4-156-0x8c47e52a34dd3e5d538d42112c0c0029676921f1',
        'approved',
        'true'
      )
      assert.fieldEquals(
        'Vote',
        '7=>4-156-0x8c47e52a34dd3e5d538d42112c0c0029676921f1',
        'votedTimestamp',
        '1'
      )
      assert.fieldEquals(
        'Vote',
        '7=>4-156-0x8c47e52a34dd3e5d538d42112c0c0029676921f1',
        'votedBlockNumber',
        '1'
      )
    })
  })

  describe('DailyStatistic entity', () => {
    test('a manually created entity has correct fields', () => {
      // Initialize a test DailyStatistic entity
      let dailyStatistic = new DailyStatistic('Test')
      dailyStatistic.date = 1653091200
      dailyStatistic.depositsCount = BI_0
      dailyStatistic.proposalsCount = BI_0
      dailyStatistic.votesCount = BI_1
      dailyStatistic.relayersCount = BI_0
      dailyStatistic.save()

      // check values for manually created test entity
      assert.fieldEquals('DailyStatistic', 'Test', 'id', 'Test')
      assert.fieldEquals('DailyStatistic', 'Test', 'date', '1653091200')
      assert.fieldEquals('DailyStatistic', 'Test', 'depositsCount', BI_0.toString())
      assert.fieldEquals('DailyStatistic', 'Test', 'proposalsCount', BI_0.toString())
      assert.fieldEquals('DailyStatistic', 'Test', 'votesCount', BI_1.toString())
      assert.fieldEquals('DailyStatistic', 'Test', 'relayersCount', BI_0.toString())
    })

    test('an entity created through a test event has correct fields', () => {
      // create a mock Relayer entity needed for this handler
      let relayer = new Relayer(ADDRESS_1)
      relayer.addedTimestamp = TIMESTAMP
      relayer.addedBlockNumber = BLOCK_NUMBER
      relayer.removedTimestamp = BI_0
      relayer.removedBlockNumber = BI_0
      relayer.voteCount = BI_0
      relayer.threshold = BI_1
      relayer.timestamp = TIMESTAMP
      relayer.blockNumber = BLOCK_NUMBER
      relayer.save()

      // create a test General entity via a test event
      let testEvent = createProposalVoteEvent(7, BigInt.fromI32(156), 3, new Bytes(1500))

      // set the mock relayer as the tx sender
      testEvent.transaction.from = Address.fromString(ADDRESS_1)

      handleNewProposalVoteEvents([testEvent])

      // check values for test entity created via test event and the Deposit event handler
      assert.fieldEquals('DailyStatistic', '0', 'id', '0')
      assert.fieldEquals('DailyStatistic', '0', 'date', '0')
      assert.fieldEquals('DailyStatistic', '0', 'depositsCount', '0')
      assert.fieldEquals('DailyStatistic', '0', 'proposalsCount', '0')
      assert.fieldEquals('DailyStatistic', '0', 'votesCount', '1')
      assert.fieldEquals('DailyStatistic', '0', 'relayersCount', '0')
    })
  })

  afterEach(() => {
    // clean the store so that the next test can start with a fresh store object
    clearStore()
  })
})

describe('handleRelayerAdded()', () => {
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
      // create a mock function for the proper execution of the handler
      createMockedFunction(
        Address.fromString(BRIDGE),
        '_relayerThreshold',
        '_relayerThreshold():(uint256)'
      )
        .withArgs([])
        .returns([ethereum.Value.fromUnsignedBigInt(BI_1)])

      // create a test General entity via a test event
      let testEvent = createRelayerAddedEvent(Address.fromString(ADDRESS_1))

      handleNewRelayerAddedEvents([testEvent])

      // check values for test entity created via test event and the Deposit event handler
      assert.fieldEquals('General', '1', 'id', '1')
      assert.fieldEquals('General', '1', 'totalDepositsCount', BI_0.toString())
      assert.fieldEquals('General', '1', 'totalProposalsCount', BI_0.toString())
      assert.fieldEquals('General', '1', 'totalVotesCount', BI_0.toString())
      assert.fieldEquals('General', '1', 'totalRelayersCount', BI_1.toString())
      assert.fieldEquals('General', '1', 'chainId', CHAIN_ID.toString())
      assert.fieldEquals('General', '1', 'subgraphVersion', SUBGRAPH_VERSION.toString())
    })
  })

  describe('Relayer entity', () => {
    test('a manually created entity has correct fields', () => {
      // Initialize a test Relayer entity
      let relayer = new Relayer('Test')
      relayer.addedTimestamp = TIMESTAMP
      relayer.addedBlockNumber = BLOCK_NUMBER
      relayer.removedTimestamp = BI_0
      relayer.removedBlockNumber = BI_0
      relayer.voteCount = BI_0
      relayer.threshold = BI_1
      relayer.timestamp = TIMESTAMP
      relayer.blockNumber = BLOCK_NUMBER
      relayer.save()

      // check values for manually created test entity
      assert.fieldEquals('Relayer', 'Test', 'id', 'Test')
      assert.fieldEquals('Relayer', 'Test', 'addedTimestamp', TIMESTAMP.toString())
      assert.fieldEquals('Relayer', 'Test', 'addedBlockNumber', BLOCK_NUMBER.toString())
      assert.fieldEquals('Relayer', 'Test', 'removedTimestamp', BI_0.toString())
      assert.fieldEquals('Relayer', 'Test', 'removedBlockNumber', BI_0.toString())
      assert.fieldEquals('Relayer', 'Test', 'voteCount', BI_0.toString())
      assert.fieldEquals('Relayer', 'Test', 'threshold', BI_1.toString())
      assert.fieldEquals('Relayer', 'Test', 'timestamp', TIMESTAMP.toString())
      assert.fieldEquals('Relayer', 'Test', 'blockNumber', BLOCK_NUMBER.toString())
    })

    test('an entity created through a test event has correct fields', () => {
      // create a mock function for the proper execution of the handler
      createMockedFunction(
        Address.fromString(BRIDGE),
        '_relayerThreshold',
        '_relayerThreshold():(uint256)'
      )
        .withArgs([])
        .returns([ethereum.Value.fromUnsignedBigInt(BI_1)])

      // create a test Vote entity via a test event
      let testEvent = createRelayerAddedEvent(Address.fromString(ADDRESS_1))

      handleNewRelayerAddedEvents([testEvent])

      // check values for test entity created via test event and the Deposit event handler
      assert.fieldEquals('Relayer', ADDRESS_1, 'id', ADDRESS_1)
      assert.fieldEquals('Relayer', ADDRESS_1, 'addedTimestamp', BI_1.toString())
      assert.fieldEquals('Relayer', ADDRESS_1, 'addedBlockNumber', BI_1.toString())
      assert.fieldEquals('Relayer', ADDRESS_1, 'removedTimestamp', BI_0.toString())
      assert.fieldEquals('Relayer', ADDRESS_1, 'removedBlockNumber', BI_0.toString())
      assert.fieldEquals('Relayer', ADDRESS_1, 'voteCount', BI_0.toString())
      assert.fieldEquals('Relayer', ADDRESS_1, 'threshold', BI_1.toString())
      assert.fieldEquals('Relayer', ADDRESS_1, 'timestamp', BI_1.toString())
      assert.fieldEquals('Relayer', ADDRESS_1, 'blockNumber', BI_1.toString())
    })
  })

  describe('DailyStatistic entity', () => {
    test('a manually created entity has correct fields', () => {
      // Initialize a test DailyStatistic entity
      let dailyStatistic = new DailyStatistic('Test')
      dailyStatistic.date = 1653091200
      dailyStatistic.depositsCount = BI_0
      dailyStatistic.proposalsCount = BI_0
      dailyStatistic.votesCount = BI_0
      dailyStatistic.relayersCount = BI_1
      dailyStatistic.save()

      // check values for manually created test entity
      assert.fieldEquals('DailyStatistic', 'Test', 'id', 'Test')
      assert.fieldEquals('DailyStatistic', 'Test', 'date', '1653091200')
      assert.fieldEquals('DailyStatistic', 'Test', 'depositsCount', BI_0.toString())
      assert.fieldEquals('DailyStatistic', 'Test', 'proposalsCount', BI_0.toString())
      assert.fieldEquals('DailyStatistic', 'Test', 'votesCount', BI_0.toString())
      assert.fieldEquals('DailyStatistic', 'Test', 'relayersCount', BI_1.toString())
    })

    test('an entity created through a test event has correct fields', () => {
      // create a mock function for the proper execution of the handler
      createMockedFunction(
        Address.fromString(BRIDGE),
        '_relayerThreshold',
        '_relayerThreshold():(uint256)'
      )
        .withArgs([])
        .returns([ethereum.Value.fromUnsignedBigInt(BI_1)])

      // create a test DailyStatistic entity via a test event
      let testEvent = createRelayerAddedEvent(Address.fromString(ADDRESS_1))

      handleNewRelayerAddedEvents([testEvent])

      // check values for test entity created via test event and the Deposit event handler
      assert.fieldEquals('DailyStatistic', '0', 'id', '0')
      assert.fieldEquals('DailyStatistic', '0', 'date', '0')
      assert.fieldEquals('DailyStatistic', '0', 'depositsCount', '0')
      assert.fieldEquals('DailyStatistic', '0', 'proposalsCount', '0')
      assert.fieldEquals('DailyStatistic', '0', 'votesCount', '0')
      assert.fieldEquals('DailyStatistic', '0', 'relayersCount', '1')
    })
  })

  afterEach(() => {
    // clean the store so that the next test can start with a fresh store object
    clearStore()
  })
})

describe('handleRelayerRemoved()', () => {
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
      // create a mock function for the proper execution of the handler
      createMockedFunction(
        Address.fromString(BRIDGE),
        '_relayerThreshold',
        '_relayerThreshold():(uint256)'
      )
        .withArgs([])
        .returns([ethereum.Value.fromUnsignedBigInt(BI_1)])

      // create a test General entity via a test event
      let testEvent = createRelayerRemovedEvent(Address.fromString(ADDRESS_1))

      handleNewRelayerRemovedEvents([testEvent])

      // check values for test entity created via test event and the Deposit event handler
      assert.fieldEquals('General', '1', 'id', '1')
      assert.fieldEquals('General', '1', 'totalDepositsCount', BI_0.toString())
      assert.fieldEquals('General', '1', 'totalProposalsCount', BI_0.toString())
      assert.fieldEquals('General', '1', 'totalVotesCount', BI_0.toString())
      assert.fieldEquals('General', '1', 'totalRelayersCount', BI_0.toString())
      assert.fieldEquals('General', '1', 'chainId', CHAIN_ID.toString())
      assert.fieldEquals('General', '1', 'subgraphVersion', SUBGRAPH_VERSION.toString())
    })
  })

  describe('Relayer entity', () => {
    test('a manually created entity has correct fields', () => {
      // Initialize a test Relayer entity
      let relayer = new Relayer('Test')
      relayer.addedTimestamp = TIMESTAMP
      relayer.addedBlockNumber = BLOCK_NUMBER
      relayer.removedTimestamp = BigInt.fromI32(1622140484)
      relayer.removedBlockNumber = BigInt.fromI32(8660410)
      relayer.voteCount = BI_0
      relayer.threshold = BI_1
      relayer.timestamp = BigInt.fromI32(1622140484)
      relayer.blockNumber = BigInt.fromI32(8660410)
      relayer.save()

      // check values for manually created test entity
      assert.fieldEquals('Relayer', 'Test', 'id', 'Test')
      assert.fieldEquals('Relayer', 'Test', 'addedTimestamp', TIMESTAMP.toString())
      assert.fieldEquals('Relayer', 'Test', 'addedBlockNumber', BLOCK_NUMBER.toString())
      assert.fieldEquals(
        'Relayer',
        'Test',
        'removedTimestamp',
        BigInt.fromI32(1622140484).toString()
      )
      assert.fieldEquals(
        'Relayer',
        'Test',
        'removedBlockNumber',
        BigInt.fromI32(8660410).toString()
      )
      assert.fieldEquals('Relayer', 'Test', 'voteCount', BI_0.toString())
      assert.fieldEquals('Relayer', 'Test', 'threshold', BI_1.toString())
      assert.fieldEquals('Relayer', 'Test', 'timestamp', BigInt.fromI32(1622140484).toString())
      assert.fieldEquals('Relayer', 'Test', 'blockNumber', BigInt.fromI32(8660410).toString())
    })

    test('an entity created through a test event has correct fields', () => {
      // Initialize a test Relayer entity
      let relayer = new Relayer(ADDRESS_1)
      relayer.addedTimestamp = TIMESTAMP
      relayer.addedBlockNumber = BLOCK_NUMBER
      relayer.removedTimestamp = BI_0
      relayer.removedBlockNumber = BI_0
      relayer.voteCount = BI_0
      relayer.threshold = BI_1
      relayer.timestamp = TIMESTAMP
      relayer.blockNumber = BLOCK_NUMBER
      relayer.save()

      // create a mock function for the proper execution of the handler
      createMockedFunction(
        Address.fromString(BRIDGE),
        '_relayerThreshold',
        '_relayerThreshold():(uint256)'
      )
        .withArgs([])
        .returns([ethereum.Value.fromUnsignedBigInt(BI_1)])

      // create a test Vote entity via a test event
      let testEvent = createRelayerRemovedEvent(Address.fromString(ADDRESS_1))

      handleNewRelayerRemovedEvents([testEvent])

      // check values for test entity created via test event and the Deposit event handler
      assert.fieldEquals('Relayer', ADDRESS_1, 'id', ADDRESS_1)
      assert.fieldEquals('Relayer', ADDRESS_1, 'addedTimestamp', TIMESTAMP.toString())
      assert.fieldEquals('Relayer', ADDRESS_1, 'addedBlockNumber', BLOCK_NUMBER.toString())
      assert.fieldEquals('Relayer', ADDRESS_1, 'removedTimestamp', BI_1.toString())
      assert.fieldEquals('Relayer', ADDRESS_1, 'removedBlockNumber', BI_1.toString())
      assert.fieldEquals('Relayer', ADDRESS_1, 'voteCount', BI_0.toString())
      assert.fieldEquals('Relayer', ADDRESS_1, 'threshold', BI_1.toString())
      assert.fieldEquals('Relayer', ADDRESS_1, 'timestamp', BI_1.toString())
      assert.fieldEquals('Relayer', ADDRESS_1, 'blockNumber', BI_1.toString())
    })
  })

  describe('DailyStatistic entity', () => {
    test('a manually created entity has correct fields', () => {
      // Initialize a test DailyStatistic entity
      let dailyStatistic = new DailyStatistic('Test')
      dailyStatistic.date = 1653091200
      dailyStatistic.depositsCount = BI_0
      dailyStatistic.proposalsCount = BI_0
      dailyStatistic.votesCount = BI_0
      dailyStatistic.relayersCount = BI_1
      dailyStatistic.save()

      // check values for manually created test entity
      assert.fieldEquals('DailyStatistic', 'Test', 'id', 'Test')
      assert.fieldEquals('DailyStatistic', 'Test', 'date', '1653091200')
      assert.fieldEquals('DailyStatistic', 'Test', 'depositsCount', BI_0.toString())
      assert.fieldEquals('DailyStatistic', 'Test', 'proposalsCount', BI_0.toString())
      assert.fieldEquals('DailyStatistic', 'Test', 'votesCount', BI_0.toString())
      assert.fieldEquals('DailyStatistic', 'Test', 'relayersCount', BI_1.toString())
    })

    test('an entity created through a test event has correct fields', () => {
      // create a mock function for the proper execution of the handler
      createMockedFunction(
        Address.fromString(BRIDGE),
        '_relayerThreshold',
        '_relayerThreshold():(uint256)'
      )
        .withArgs([])
        .returns([ethereum.Value.fromUnsignedBigInt(BI_1)])

      // create a test DailyStatistic entity via a test event
      let testEvent = createRelayerRemovedEvent(Address.fromString(ADDRESS_1))

      handleNewRelayerRemovedEvents([testEvent])

      // check values for test entity created via test event and the Deposit event handler
      assert.fieldEquals('DailyStatistic', '0', 'id', '0')
      assert.fieldEquals('DailyStatistic', '0', 'date', '0')
      assert.fieldEquals('DailyStatistic', '0', 'depositsCount', '0')
      assert.fieldEquals('DailyStatistic', '0', 'proposalsCount', '0')
      assert.fieldEquals('DailyStatistic', '0', 'votesCount', '0')
      assert.fieldEquals('DailyStatistic', '0', 'relayersCount', '-1')
    })
  })

  afterEach(() => {
    // clean the store so that the next test can start with a fresh store object
    clearStore()
  })
})

describe('handleRelayerThresholdChanged()', () => {
  describe('Relayer entity', () => {
    test('a manually created entity has correct fields', () => {
      // Initialize a test Relayer entity
      let relayer = new Relayer('Test')
      relayer.addedTimestamp = TIMESTAMP
      relayer.addedBlockNumber = BLOCK_NUMBER
      relayer.removedTimestamp = BI_0
      relayer.removedBlockNumber = BI_0
      relayer.voteCount = BI_0
      relayer.threshold = BI_1
      relayer.timestamp = TIMESTAMP
      relayer.blockNumber = BLOCK_NUMBER
      relayer.save()

      // check values for manually created test entity
      assert.fieldEquals('Relayer', 'Test', 'id', 'Test')
      assert.fieldEquals('Relayer', 'Test', 'addedTimestamp', TIMESTAMP.toString())
      assert.fieldEquals('Relayer', 'Test', 'addedBlockNumber', BLOCK_NUMBER.toString())
      assert.fieldEquals('Relayer', 'Test', 'removedTimestamp', BI_0.toString())
      assert.fieldEquals('Relayer', 'Test', 'removedBlockNumber', BI_0.toString())
      assert.fieldEquals('Relayer', 'Test', 'voteCount', BI_0.toString())
      assert.fieldEquals('Relayer', 'Test', 'threshold', BI_1.toString())
      assert.fieldEquals('Relayer', 'Test', 'timestamp', TIMESTAMP.toString())
      assert.fieldEquals('Relayer', 'Test', 'blockNumber', BLOCK_NUMBER.toString())
    })

    test('an entity created through a test event has correct fields', () => {
      // create and update a test Relayer entity via a test event
      let relayer = new Relayer(ADDRESS_1)
      relayer.addedTimestamp = TIMESTAMP
      relayer.addedBlockNumber = BLOCK_NUMBER
      relayer.removedTimestamp = BI_0
      relayer.removedBlockNumber = BI_0
      relayer.voteCount = BI_0
      relayer.threshold = BI_1
      relayer.timestamp = TIMESTAMP
      relayer.blockNumber = BLOCK_NUMBER
      relayer.save()

      let testEvent = createRelayerThresholdChangedEvent(BigInt.fromI32(10))

      // set the mock relayer as the tx sender
      testEvent.transaction.from = Address.fromString(ADDRESS_1)

      handleNewRelayerThresholdChangedEvents([testEvent])

      // check values for test entity created via test event and the Deposit event handler
      assert.fieldEquals('Relayer', ADDRESS_1, 'id', ADDRESS_1)
      assert.fieldEquals('Relayer', ADDRESS_1, 'addedTimestamp', TIMESTAMP.toString())
      assert.fieldEquals('Relayer', ADDRESS_1, 'addedBlockNumber', BLOCK_NUMBER.toString())
      assert.fieldEquals('Relayer', ADDRESS_1, 'removedTimestamp', BI_0.toString())
      assert.fieldEquals('Relayer', ADDRESS_1, 'removedBlockNumber', BI_0.toString())
      assert.fieldEquals('Relayer', ADDRESS_1, 'voteCount', BI_0.toString())
      assert.fieldEquals('Relayer', ADDRESS_1, 'threshold', BigInt.fromI32(10).toString())
      assert.fieldEquals('Relayer', ADDRESS_1, 'timestamp', BI_1.toString())
      assert.fieldEquals('Relayer', ADDRESS_1, 'blockNumber', BI_1.toString())
    })
  })

  afterEach(() => {
    // clean the store so that the next test can start with a fresh store object
    clearStore()
  })
})

describe('handleRoleGranted()', () => {
  describe('User entity', () => {
    test('a manually created entity has correct fields', () => {
      // Initialize a test User entity
      let user = new User('Test')
      user.createdTimestamp = TIMESTAMP
      user.createdBlockNumber = BLOCK_NUMBER
      user.save()

      // check values for manually created test entity
      assert.fieldEquals('User', 'Test', 'id', 'Test')
      assert.fieldEquals('User', 'Test', 'createdTimestamp', TIMESTAMP.toString())
      assert.fieldEquals('User', 'Test', 'createdBlockNumber', BLOCK_NUMBER.toString())
    })

    test('an entity created through a test event has correct fields', () => {
      // create a test User entity via a test event
      let testEvent = createRoleGrantedEvent(
        new Bytes(1700),
        Address.fromString(ADDRESS_1),
        Address.fromString(ADDRESS_2)
      )

      handleNewRoleGrantedEvents([testEvent])

      // check values for test entity created via test event and the Deposit event handler
      assert.fieldEquals('User', ADDRESS_1, 'id', ADDRESS_1)
      assert.fieldEquals('User', ADDRESS_1, 'createdTimestamp', '1')
      assert.fieldEquals('User', ADDRESS_1, 'createdBlockNumber', '1')
    })
  })

  describe('Role entity', () => {
    test('a manually created entity has correct fields', () => {
      // Initialize a test Role entity
      let role = new Role('Test')
      role.user = 'TestUserID'
      role.role = RELAYER_ROLE
      role.sender = Address.fromString(ADDRESS_2)
      role.currentlyHeld = true
      role.timestamp = TIMESTAMP
      role.blockNumber = BLOCK_NUMBER
      role.save()

      // check values for manually created test entity
      assert.fieldEquals('Role', 'Test', 'id', 'Test')
      assert.fieldEquals('Role', 'Test', 'user', 'TestUserID')
      assert.fieldEquals('Role', 'Test', 'role', RELAYER_ROLE)
      assert.fieldEquals('Role', 'Test', 'sender', ADDRESS_2)
      assert.fieldEquals('Role', 'Test', 'currentlyHeld', 'true')
      assert.fieldEquals('Role', 'Test', 'timestamp', TIMESTAMP.toString())
      assert.fieldEquals('Role', 'Test', 'blockNumber', BLOCK_NUMBER.toString())
    })

    test('an entity created through a test event has correct fields', () => {
      // create a test Role entity via a test event
      let testEvent = createRoleGrantedEvent(
        new Bytes(1700),
        Address.fromString(ADDRESS_1),
        Address.fromString(ADDRESS_2)
      )

      handleNewRoleGrantedEvents([testEvent])

      // check values for test entity created via test event and the Deposit event handler
      assert.fieldEquals(
        'Role',
        new Bytes(1700).toHex().concat('-').concat(ADDRESS_1),
        'id',
        new Bytes(1700).toHex().concat('-').concat(ADDRESS_1)
      )
      assert.fieldEquals(
        'Role',
        new Bytes(1700).toHex().concat('-').concat(ADDRESS_1),
        'user',
        ADDRESS_1
      )
      assert.fieldEquals(
        'Role',
        new Bytes(1700).toHex().concat('-').concat(ADDRESS_1),
        'role',
        'unknown role'
      )
      assert.fieldEquals(
        'Role',
        new Bytes(1700).toHex().concat('-').concat(ADDRESS_1),
        'sender',
        ADDRESS_2
      )
      assert.fieldEquals(
        'Role',
        new Bytes(1700).toHex().concat('-').concat(ADDRESS_1),
        'currentlyHeld',
        'true'
      )
      assert.fieldEquals(
        'Role',
        new Bytes(1700).toHex().concat('-').concat(ADDRESS_1),
        'timestamp',
        '1'
      )
      assert.fieldEquals(
        'Role',
        new Bytes(1700).toHex().concat('-').concat(ADDRESS_1),
        'blockNumber',
        '1'
      )
    })
  })

  afterEach(() => {
    // clean the store so that the next test can start with a fresh store object
    clearStore()
  })
})

describe('handleRoleRevoked()', () => {
  describe('User entity', () => {
    test('a manually created entity has correct fields', () => {
      // Initialize a test User entity
      let user = new User('Test')
      user.createdTimestamp = TIMESTAMP
      user.createdBlockNumber = BLOCK_NUMBER
      user.save()

      // check values for manually created test entity
      assert.fieldEquals('User', 'Test', 'id', 'Test')
      assert.fieldEquals('User', 'Test', 'createdTimestamp', TIMESTAMP.toString())
      assert.fieldEquals('User', 'Test', 'createdBlockNumber', BLOCK_NUMBER.toString())
    })

    test('an entity created through a test event has correct fields', () => {
      // create a test User entity via a test event
      let testEvent = createRoleRevokedEvent(
        new Bytes(1700),
        Address.fromString(ADDRESS_1),
        Address.fromString(ADDRESS_2)
      )

      handleNewRoleRevokedEvents([testEvent])

      // check values for test entity created via test event and the Deposit event handler
      assert.fieldEquals('User', ADDRESS_1, 'id', ADDRESS_1)
      assert.fieldEquals('User', ADDRESS_1, 'createdTimestamp', '1')
      assert.fieldEquals('User', ADDRESS_1, 'createdBlockNumber', '1')
    })
  })

  describe('Role entity', () => {
    test('a manually created entity has correct fields', () => {
      // Initialize a test Role entity
      let role = new Role('Test')
      role.user = 'TestUserID'
      role.role = RELAYER_ROLE
      role.sender = Address.fromString(ADDRESS_2)
      role.currentlyHeld = true
      role.timestamp = TIMESTAMP
      role.blockNumber = BLOCK_NUMBER
      role.save()

      // check values for manually created test entity
      assert.fieldEquals('Role', 'Test', 'id', 'Test')
      assert.fieldEquals('Role', 'Test', 'user', 'TestUserID')
      assert.fieldEquals('Role', 'Test', 'role', RELAYER_ROLE)
      assert.fieldEquals('Role', 'Test', 'sender', ADDRESS_2)
      assert.fieldEquals('Role', 'Test', 'currentlyHeld', 'true')
      assert.fieldEquals('Role', 'Test', 'timestamp', TIMESTAMP.toString())
      assert.fieldEquals('Role', 'Test', 'blockNumber', BLOCK_NUMBER.toString())
    })

    test('an entity created through a test event has correct fields', () => {
      // create a test Role entity via a test event
      let testEvent = createRoleRevokedEvent(
        new Bytes(1700),
        Address.fromString(ADDRESS_1),
        Address.fromString(ADDRESS_2)
      )

      handleNewRoleRevokedEvents([testEvent])

      // check values for test entity created via test event and the Deposit event handler
      assert.fieldEquals(
        'Role',
        new Bytes(1700).toHex().concat('-').concat(ADDRESS_1),
        'id',
        new Bytes(1700).toHex().concat('-').concat(ADDRESS_1)
      )
      assert.fieldEquals(
        'Role',
        new Bytes(1700).toHex().concat('-').concat(ADDRESS_1),
        'user',
        ADDRESS_1
      )
      assert.fieldEquals(
        'Role',
        new Bytes(1700).toHex().concat('-').concat(ADDRESS_1),
        'role',
        'unknown role'
      )
      assert.fieldEquals(
        'Role',
        new Bytes(1700).toHex().concat('-').concat(ADDRESS_1),
        'sender',
        ADDRESS_2
      )
      assert.fieldEquals(
        'Role',
        new Bytes(1700).toHex().concat('-').concat(ADDRESS_1),
        'currentlyHeld',
        'false'
      )
      assert.fieldEquals(
        'Role',
        new Bytes(1700).toHex().concat('-').concat(ADDRESS_1),
        'timestamp',
        '1'
      )
      assert.fieldEquals(
        'Role',
        new Bytes(1700).toHex().concat('-').concat(ADDRESS_1),
        'blockNumber',
        '1'
      )
    })
  })

  afterEach(() => {
    // clean the store so that the next test can start with a fresh store object
    clearStore()
  })
})

import { Address, BigInt, Bytes, ethereum } from '@graphprotocol/graph-ts'
import { newMockEvent } from 'matchstick-as'
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

// used to create a new `ProposalVote` test event
export function createProposalVoteEvent(
  originChainID: i32,
  depositNonce: BigInt,
  status: i32,
  resourceID: Bytes
): ProposalVote {
  let newProposalVoteEvent = changetype<ProposalVote>(newMockEvent())
  newProposalVoteEvent.parameters = new Array()
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

  newProposalVoteEvent.parameters.push(originChainIDParam)
  newProposalVoteEvent.parameters.push(depositNonceParam)
  newProposalVoteEvent.parameters.push(statusParam)
  newProposalVoteEvent.parameters.push(resourceIDParam)

  return newProposalVoteEvent
}

// used to handle `ProposalVote` test events
export function handleNewProposalVoteEvents(events: ProposalVote[]): void {
  events.forEach((event) => {
    handleProposalVote(event)
  })
}

// used to create a new `RelayerAdded` test event
export function createRelayerAddedEvent(relayer: Address): RelayerAdded {
  let newRelayerAddedEvent = changetype<RelayerAdded>(newMockEvent())
  newRelayerAddedEvent.parameters = new Array()
  let relayerParam = new ethereum.EventParam('relayer', ethereum.Value.fromAddress(relayer))

  newRelayerAddedEvent.parameters.push(relayerParam)

  return newRelayerAddedEvent
}

// used to handle `RelayerAdded` test events
export function handleNewRelayerAddedEvents(events: RelayerAdded[]): void {
  events.forEach((event) => {
    handleRelayerAdded(event)
  })
}

// used to create a new `RelayerRemoved` test event
export function createRelayerRemovedEvent(relayer: Address): RelayerRemoved {
  let newRelayerRemovedEvent = changetype<RelayerRemoved>(newMockEvent())
  newRelayerRemovedEvent.parameters = new Array()
  let relayerParam = new ethereum.EventParam('relayer', ethereum.Value.fromAddress(relayer))

  newRelayerRemovedEvent.parameters.push(relayerParam)

  return newRelayerRemovedEvent
}

// used to handle `RelayerRemoved` test events
export function handleNewRelayerRemovedEvents(events: RelayerRemoved[]): void {
  events.forEach((event) => {
    handleRelayerRemoved(event)
  })
}

// used to create a new `RelayerThresholdChanged` test event
export function createRelayerThresholdChangedEvent(newThreshold: BigInt): RelayerThresholdChanged {
  let newRelayerThresholdChangedEvent = changetype<RelayerThresholdChanged>(newMockEvent())
  newRelayerThresholdChangedEvent.parameters = new Array()
  let newThresholdParam = new ethereum.EventParam(
    'newThreshold',
    ethereum.Value.fromUnsignedBigInt(newThreshold)
  )

  newRelayerThresholdChangedEvent.parameters.push(newThresholdParam)

  return newRelayerThresholdChangedEvent
}

// used to handle `RelayerThresholdChanged` test events
export function handleNewRelayerThresholdChangedEvents(events: RelayerThresholdChanged[]): void {
  events.forEach((event) => {
    handleRelayerThresholdChanged(event)
  })
}

// used to create a new `RoleGranted` test event
export function createRoleGrantedEvent(
  role: Bytes,
  account: Address,
  sender: Address
): RoleGranted {
  let newRoleGrantedEvent = changetype<RoleGranted>(newMockEvent())
  newRoleGrantedEvent.parameters = new Array()
  let roleParam = new ethereum.EventParam('role', ethereum.Value.fromFixedBytes(role))
  let accountParam = new ethereum.EventParam('account', ethereum.Value.fromAddress(account))
  let senderParam = new ethereum.EventParam('sender', ethereum.Value.fromAddress(sender))

  newRoleGrantedEvent.parameters.push(roleParam)
  newRoleGrantedEvent.parameters.push(accountParam)
  newRoleGrantedEvent.parameters.push(senderParam)

  return newRoleGrantedEvent
}

// used to handle `RoleGranted` test events
export function handleNewRoleGrantedEvents(events: RoleGranted[]): void {
  events.forEach((event) => {
    handleRoleGranted(event)
  })
}

// used to create a new `RoleRevoked` test event
export function createRoleRevokedEvent(
  role: Bytes,
  account: Address,
  sender: Address
): RoleRevoked {
  let newRoleRevokedEvent = changetype<RoleRevoked>(newMockEvent())
  newRoleRevokedEvent.parameters = new Array()
  let roleParam = new ethereum.EventParam('role', ethereum.Value.fromFixedBytes(role))
  let accountParam = new ethereum.EventParam('account', ethereum.Value.fromAddress(account))
  let senderParam = new ethereum.EventParam('sender', ethereum.Value.fromAddress(sender))

  newRoleRevokedEvent.parameters.push(roleParam)
  newRoleRevokedEvent.parameters.push(accountParam)
  newRoleRevokedEvent.parameters.push(senderParam)

  return newRoleRevokedEvent
}

// used to handle `RoleRevoked` test events
export function handleNewRoleRevokedEvents(events: RoleRevoked[]): void {
  events.forEach((event) => {
    handleRoleRevoked(event)
  })
}

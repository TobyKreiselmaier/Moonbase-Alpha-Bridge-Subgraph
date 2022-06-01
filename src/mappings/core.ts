import { BigInt } from '@graphprotocol/graph-ts'
import {
  Deposit,
  ProposalEvent,
  ProposalVote,
  RelayerAdded,
  RelayerRemoved,
  RelayerThresholdChanged,
  RoleGranted,
  RoleRevoked
} from '../../generated/Bridge/Bridge' // events
import {
  General,
  Proposal,
  ProposalCount,
  Relayer,
  Role,
  UserDeposit,
  User,
  Vote
} from '../../generated/schema' // entities
import { CHAIN_ID, SUBGRAPH_VERSION } from './config'
import { updateDailyStatistic } from './dailyStatistics'
import { BI_0, BI_1, BI_MINUS_1, concatFiltered } from './helpers'

export function handleDeposit(event: Deposit): void {
  let timestamp = event.block.timestamp

  // update or create a new General entity
  let general = General.load('1') as General | null
  if (!general) {
    general = new General('1')
    general.totalDepositsCount = BI_0
    general.totalProposalsCount = BI_0
    general.votesCount = BI_0
    general.relayersCount = BI_0
    general.chainId = CHAIN_ID
    general.subgraphVersion = SUBGRAPH_VERSION
  }
  general.totalDepositsCount = (general.totalDepositsCount as BigInt).plus(BI_1)
  general.save()

  // create a new UserDeposit entity
  let userDeposit = new UserDeposit(
    CHAIN_ID.toString()
      .concat('=>')
      .concat(event.params.destinationChainID.toString())
      .concat('-')
      .concat(event.params.depositNonce.toString())
  )
  userDeposit.originChainId = CHAIN_ID
  userDeposit.destinationChainId = event.params.destinationChainID
  userDeposit.resourceId = event.params.resourceID
  userDeposit.nonce = event.params.depositNonce
  userDeposit.createdTimestamp = timestamp
  userDeposit.createdBlockNumber = event.block.number
  userDeposit.save()

  // update daily statistic
  updateDailyStatistic(BI_1, BI_0, BI_0, BI_0, timestamp)
}

export function handleProposalEvent(event: ProposalEvent): void {
  let bridge = event.params.originChainID.toString().concat('=>').concat(CHAIN_ID.toString())
  let eventID = bridge.concat('-').concat(event.params.depositNonce.toString())
  let timestamp = event.block.timestamp
  let blockNumber = event.block.number
  let sender = event.transaction.from.toHex()

  // update or create a new General entity
  let general = General.load('1') as General | null
  if (!general) {
    general = new General('1')
    general.totalDepositsCount = BI_0
    general.totalProposalsCount = BI_0
    general.votesCount = BI_0
    general.relayersCount = BI_0
    general.chainId = CHAIN_ID
    general.subgraphVersion = SUBGRAPH_VERSION
  }
  general.totalProposalsCount = (general.totalProposalsCount as BigInt).plus(BI_1)
  general.save()

  // create or update UserDeposit entity
  let userDeposit = UserDeposit.load(eventID) as UserDeposit | null
  if (!userDeposit) {
    userDeposit = new UserDeposit(eventID)
    userDeposit.originChainId = event.params.originChainID
    userDeposit.destinationChainId = CHAIN_ID
    userDeposit.resourceId = event.params.resourceID
    userDeposit.nonce = event.params.depositNonce
    userDeposit.createdTimestamp = timestamp
    userDeposit.createdBlockNumber = blockNumber
  }

  // connect proposal and deposit
  userDeposit.proposal = eventID
  userDeposit.save()

  // create or update a Proposal entity
  let proposal = Proposal.load(eventID) as Proposal | null
  if (!proposal) {
    proposal = new Proposal(eventID)
    proposal.deposit = userDeposit.id
    proposal.originChainId = event.params.originChainID
    proposal.destinationChainId = CHAIN_ID
    proposal.resourceId = userDeposit.resourceId
    proposal.status = ''
    proposal.dataHash = event.params.dataHash
    proposal.createdBy = sender
    proposal.passedBy = ''
    proposal.executedBy = ''
    proposal.canceledBy = ''
    proposal.votes = new Array<string>(0)
    proposal.createdTimestamp = timestamp
    proposal.createdBlockNumber = blockNumber
    proposal.passedTimestamp = BI_0
    proposal.passedBlockNumber = BI_0
    proposal.executedTimestamp = BI_0
    proposal.executedBlockNumber = BI_0
    proposal.canceledTimestamp = BI_0
    proposal.canceledBlockNumber = BI_0
  }

  // update Relayer entity
  let relayer = Relayer.load(sender) as Relayer | null
  if (!relayer) {
    relayer = new Relayer(sender)
    relayer.addedTimestamp = timestamp
    relayer.addedBlockNumber = blockNumber
    relayer.removedTimestamp = BI_0
    relayer.removedBlockNumber = BI_0
    relayer.votes = new Array<string>(0)
    relayer.voteCount = BI_0
    relayer.threshold = BI_0
    relayer.createdProposals = new Array<string>(0)
    relayer.passedProposals = new Array<string>(0)
    relayer.executedProposals = new Array<string>(0)
    relayer.canceledProposals = new Array<string>(0)
    relayer.timestamp = timestamp
    relayer.blockNumber = blockNumber
  }

  switch (event.params.status) {
    case 0:
      proposal.status = 'inactive'
      break

    case 1:
      proposal.status = 'active'
      relayer.createdProposals = (relayer.createdProposals as string[]).concat([proposal.id])
      break

    case 2:
      proposal.status = 'passed'
      proposal.passedTimestamp = timestamp
      proposal.passedBlockNumber = blockNumber
      proposal.passedBy = sender
      relayer.passedProposals = (relayer.passedProposals as string[]).concat([proposal.id])
      break

    case 3:
      proposal.status = 'executed'
      proposal.executedTimestamp = timestamp
      proposal.executedBlockNumber = blockNumber
      proposal.executedBy = sender
      relayer.executedProposals = (relayer.executedProposals as string[]).concat([proposal.id])
      break

    case 4:
      proposal.status = 'canceled'
      proposal.canceledTimestamp = timestamp
      proposal.canceledBlockNumber = blockNumber
      proposal.canceledBy = sender
      relayer.canceledProposals = (relayer.canceledProposals as string[]).concat([proposal.id])
      break
  }
  proposal.save()
  relayer.save()

  // create or update the ProposalCount entity
  let proposalCount = ProposalCount.load(bridge) as ProposalCount | null
  if (!proposalCount) {
    proposalCount = new ProposalCount(bridge)
    proposalCount.originChainId = event.params.originChainID
    proposalCount.destinationChainId = CHAIN_ID
    proposalCount.count = BI_0
  }
  proposalCount.count = (proposalCount.count as BigInt).plus(BI_1)
  proposalCount.timestamp = timestamp
  proposalCount.blockNumber = blockNumber
  proposalCount.save()

  // update daily statistic
  updateDailyStatistic(BI_0, BI_1, BI_0, BI_0, timestamp)
}

export function handleProposalVote(event: ProposalVote): void {
  let originChain = event.params.originChainID.toString()
  let depositNonce = event.params.depositNonce.toString()
  let sender = event.transaction.from.toHex()
  let timestamp = event.block.timestamp

  // update or create a new General entity
  let general = General.load('1') as General | null
  if (!general) {
    general = new General('1')
    general.totalDepositsCount = BI_0
    general.totalProposalsCount = BI_0
    general.votesCount = BI_0
    general.relayersCount = BI_0
    general.chainId = CHAIN_ID
    general.subgraphVersion = SUBGRAPH_VERSION
  }
  general.votesCount = (general.votesCount as BigInt).plus(BI_1)
  general.save()

  // create Vote entity
  let vote = new Vote(
    originChain
      .concat('=>')
      .concat(CHAIN_ID.toString())
      .concat('-')
      .concat(depositNonce)
      .concat('-')
      .concat(sender)
  )
  vote.relayer = sender
  vote.proposal = originChain
    .concat('=>')
    .concat(CHAIN_ID.toString())
    .concat('-')
    .concat(depositNonce)
  vote.approved = true
  vote.votedTimestamp = timestamp
  vote.votedBlockNumber = event.block.number
  vote.save()

  // update Relayer entity
  let relayer = Relayer.load(sender) as Relayer
  relayer.votes = (relayer.votes as string[]).concat([vote.id])
  relayer.voteCount = (relayer.voteCount as BigInt).plus(BI_1)
  relayer.save()

  // update daily statistic
  updateDailyStatistic(BI_0, BI_0, BI_1, BI_0, timestamp)
}

export function handleRelayerAdded(event: RelayerAdded): void {
  let timestamp = event.block.timestamp
  let blockNumber = event.block.number

  // create or update the General entity
  let general = General.load('1') as General | null
  if (!general) {
    general = new General('1')
    general.totalDepositsCount = BI_0
    general.totalProposalsCount = BI_0
    general.votesCount = BI_0
    general.relayersCount = BI_0
    general.chainId = CHAIN_ID
    general.subgraphVersion = SUBGRAPH_VERSION
  }
  general.relayersCount = (general.relayersCount as BigInt).plus(BI_1)
  general.save()

  // create Relayer entity
  let relayer = new Relayer(event.params.relayer.toHex())
  relayer.addedTimestamp = timestamp
  relayer.addedBlockNumber = blockNumber
  relayer.removedTimestamp = BI_0
  relayer.removedBlockNumber = BI_0
  relayer.votes = new Array<string>(0)
  relayer.voteCount = BI_0
  relayer.threshold = BI_0
  relayer.createdProposals = new Array<string>(0)
  relayer.passedProposals = new Array<string>(0)
  relayer.executedProposals = new Array<string>(0)
  relayer.canceledProposals = new Array<string>(0)
  relayer.timestamp = timestamp
  relayer.blockNumber = blockNumber
  relayer.save()

  // update daily statistic
  updateDailyStatistic(BI_0, BI_0, BI_0, BI_1, timestamp)
}

export function handleRelayerRemoved(event: RelayerRemoved): void {
  let timestamp = event.block.timestamp
  let blockNumber = event.block.number

  // create or update the General entity
  let general = General.load('1') as General | null
  if (!general) {
    general = new General('1')
    general.totalDepositsCount = BI_0
    general.totalProposalsCount = BI_0
    general.votesCount = BI_0
    general.relayersCount = BI_0
    general.chainId = CHAIN_ID
    general.subgraphVersion = SUBGRAPH_VERSION
  }
  if ((general.relayersCount as BigInt).gt(BI_0)) {
    general.relayersCount = (general.relayersCount as BigInt).minus(BI_1)
  }
  general.save()

  // update Relayer entity
  let relayer = Relayer.load(event.params.relayer.toHex()) as Relayer
  relayer.removedTimestamp = timestamp
  relayer.removedBlockNumber = blockNumber
  relayer.timestamp = timestamp
  relayer.blockNumber = blockNumber
  relayer.save()

  // update daily statistic
  updateDailyStatistic(BI_0, BI_0, BI_0, BI_MINUS_1, timestamp)
}

export function handleRelayerThresholdChanged(event: RelayerThresholdChanged): void {
  // update Relayer entity
  let relayer = Relayer.load(event.transaction.from.toHex()) as Relayer
  relayer.threshold = event.params.newThreshold
  relayer.save()
}

export function handleRoleGranted(event: RoleGranted): void {
  let timestamp = event.block.timestamp
  let blockNumber = event.block.number
  let roleID = event.params.role.toHex().concat('-').concat(event.params.account.toHex())

  // create or update User entity
  let user = User.load(event.params.account.toHex()) as User | null
  if (!user) {
    user = new User(event.params.account.toHex())
    user.roles = new Array<string>(0)
    user.createdTimestamp = timestamp
    user.createdBlockNumber = blockNumber
  }

  // create or update Role entity
  let role = Role.load(roleID) as Role | null
  if (!role) {
    role = new Role(roleID)
    role.user = user.id
    role.role = event.params.role
    role.sender = event.params.sender
  }
  role.currentlyHeld = true
  role.blockNumber = blockNumber
  role.timestamp = timestamp

  user.roles = concatFiltered(user.roles as string[], [role.id])
  user.save()
  role.save()
}

export function handleRoleRevoked(event: RoleRevoked): void {
  let timestamp = event.block.timestamp
  let blockNumber = event.block.number
  let roleID = event.params.role.toHex().concat('-').concat(event.params.account.toHex())

  // create or update User entity
  let user = User.load(event.params.account.toHex()) as User | null
  if (!user) {
    user = new User(event.params.account.toHex())
    user.roles = new Array<string>(0)
    user.createdTimestamp = timestamp
    user.createdBlockNumber = blockNumber
  }

  // create or update Role entity
  let role = Role.load(roleID) as Role | null
  if (!role) {
    role = new Role(roleID)
    role.user = user.id
    role.role = event.params.role
    role.sender = event.params.sender
  }
  role.currentlyHeld = false
  role.blockNumber = event.block.number
  role.timestamp = event.block.timestamp

  user.roles = concatFiltered(user.roles as string[], [role.id])
  user.save()
  role.save()
}

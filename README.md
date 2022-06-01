# Moonbase Alpha Bridge Subgraph

This subgraph tracks activity related to the Moonbase Alpha Bridge contract

- Deposits
- Proposals
- Votes
- Relayers
- Roles
- General & Daily Statistics

## Requirements

- node v16+
- yarn v1.22+
- [The Graph Hosted Service](https://thegraph.com/hosted-service/)

## Linting

To lint the code with `prettier` run:

```sh
yarn lint
```

## Settings

- [x] Set endpoints, and subgraph-name in `.env` (for deployment to production graph-node) or `.env.local` (for deployment to local test graph-node) files. Check the `environments` folder for templates.
- [x] Make sure `subgraph.yaml` refers to the same contracts and the same blockchain as `.env` / `.env.local`. Check the `manifests` folder for templates.
- [x] Ensure that the startblocks are the creation blocks of the related contracts in `subgraph.yaml`
- [x] Set the correct chain in `src/config.ts` according to the blockchain you're intending to use by using comments.

Then run the following commands:

```sh
yarn
yarn codegen
yarn build
```

If you want to deploy to a local graph-node, you can do so by following the instructions here: https://github.com/graphprotocol/graph-node/blob/master/README.md.

## Deployment to local graph-node

Run the following commands to deploy the Moonbase Alpha Bridge subgraph to a local graph-node:

```sh
yarn create-local
yarn deploy-local
```

### Deployment to remote graph-node

Run the following commands to deploy the Moonbase Alpha Bridge subgraph to a remote graph-node:

```sh
yarn run create
yarn run deploy
```

### Querying Data

This example query fetches `General` statistical data:

```graphql
query General {
  general(id: "1") {
    totalDepositsCount
    totalProposalsCount
    totalVotesCount
    totalRelayersCount
    chainId
    subgraphVersion
  }
}
```

This example query fetches `Deposits` data:

```graphql
query Deposits {
  userDeposits(first: 5) {
    id
    originChainId
    destinationChainId
    resourceId
    nonce
    createdTimestamp
    createdBlockNumber
  }
}
```

This example query fetches `Proposals` data:

```graphql
query Proposals {
  proposals(first: 5) {
    id
    originChainId
    destinationChainId
    resourceId
    status
    dataHash
    createdBy(first: 1) {
      id
    }
    passedBy(first: 1) {
      id
    }
    executedBy(first: 1) {
      id
    }
    canceledBy(first: 1) {
      id
    }
    createdTimestamp
    createdBlockNumber
    passedTimestamp
    passedBlockNumber
    executedTimestamp
    executedBlockNumber
    canceledTimestamp
    canceledBlockNumber
  }
}
```

This example query fetches `Votes` data:

```graphql
query Votes {
  votes(first: 5) {
    id
    approved
    votedTimestamp
    votedBlockNumber
  }
}
```

This example query fetches `Relayers` data:

```graphql
query Relayers {
  relayers(first: 1) {
    id
    addedTimestamp
    addedBlockNumber
    removedTimestamp
    removedBlockNumber
    voteCount
    threshold
    createdProposals(first: 3) {
      id
    }
    passedProposals(first: 3) {
      id
    }
    executedProposals(first: 3) {
      id
    }
    canceledProposals(first: 3) {
      id
    }
    timestamp
    blockNumber
  }
}
```

This example query fetches `Roles` data:

```graphql
query Roles {
  roles(first: 5) {
    id
    user {
      id
    }
    role
    sender
    currentlyHeld
    timestamp
    blockNumber
  }
}

```
This example query fetches `DailyStatistics` data:

```graphql
query DailyStatistics {
  dailyStatistics(first: 5, orderBy: date, orderDirection: desc) {
    id
    date
    depositsCount
    proposalsCount
    votesCount
    relayersCount
  }
}
```

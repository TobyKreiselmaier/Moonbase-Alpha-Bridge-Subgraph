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

- [x] Set endpoints, and subgraph-name in `.env.local` (for deployment to local test graph-node) files.
- [x] Make sure `subgraph.yaml` refers to the same contracts and the same blockchain as `.env.local`. Check the `manifests` folder for templates.
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

[Full Query on Hosted Service](https://api.thegraph.com/subgraphs/name/tobykreiselmaier/moonbase-alpha-bridge-subgraph/graphql?query=query+General+%7B%0A++general%28id%3A+%221%22%29+%7B%0A++++totalDepositsCount%0A++++totalProposalsCount%0A++++totalVotesCount%0A++++totalRelayersCount%0A++++chainId%0A++++subgraphVersion%0A++%7D%0A++userDeposits%28first%3A+5%29+%7B%0A++++id%0A++++originChainId%0A++++destinationChainId%0A++++resourceId%0A++++nonce%0A++++createdTimestamp%0A++++createdBlockNumber%0A++%7D%0A++proposals%28first%3A+5%29+%7B%0A++++id%0A++++originChainId%0A++++destinationChainId%0A++++resourceId%0A++++status%0A++++dataHash%0A++++createdBy%28first%3A+1%29+%7B%0A++++++id%0A++++%7D%0A++++passedBy%28first%3A+1%29+%7B%0A++++++id%0A++++%7D%0A++++executedBy%28first%3A+1%29+%7B%0A++++++id%0A++++%7D%0A++++canceledBy%28first%3A+1%29+%7B%0A++++++id%0A++++%7D%0A++++createdTimestamp%0A++++createdBlockNumber%0A++++passedTimestamp%0A++++passedBlockNumber%0A++++executedTimestamp%0A++++executedBlockNumber%0A++++canceledTimestamp%0A++++canceledBlockNumber%0A++%7D%0A++votes%28first%3A+5%29+%7B%0A++++id%0A++++approved%0A++++votedTimestamp%0A++++votedBlockNumber%0A++%7D%0A++relayers%28first%3A+1%29+%7B%0A++++id%0A++++addedTimestamp%0A++++addedBlockNumber%0A++++removedTimestamp%0A++++removedBlockNumber%0A++++voteCount%0A++++threshold%0A++++createdProposals%28first%3A+3%29+%7B%0A++++++id%0A++++%7D%0A++++passedProposals%28first%3A+3%29+%7B%0A++++++id%0A++++%7D%0A++++executedProposals%28first%3A+3%29+%7B%0A++++++id%0A++++%7D%0A++++canceledProposals%28first%3A+3%29+%7B%0A++++++id%0A++++%7D%0A++++timestamp%0A++++blockNumber%0A++%7D%0A++roles%28first%3A+5%29+%7B%0A++++id%0A++++user+%7B%0A++++++id%0A++++%7D%0A++++role%0A++++sender%0A++++currentlyHeld%0A++++timestamp%0A++++blockNumber%0A++%7D%0A++dailyStatistics%28first%3A+5%2C+orderBy%3A+date%2C+orderDirection%3A+desc%29+%7B%0A++++id%0A++++date%0A++++depositsCount%0A++++proposalsCount%0A++++votesCount%0A++++relayersCount%0A++%7D%0A%7D)

# Moonbase Alpha Bridge Subgraph

This subgraph tracks activity related to the Moonbase Alpha Bridge contracts

- deposits
- proposals
- relayers

## Requirements

- node v16.14+
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

If you want to deploy to a local graph-node, you can do so by following the instructions here: https://git.energi.software/energi/tech/defi/swap/graph-node.

## Deployment to local graph-node

Run the following commands to deploy the GMI subgraph to a local graph-node:

```sh
yarn create-local
yarn deploy-local
```

### Deployment to remote graph-node

Run the following commands to deploy the GMI subgraph to a remote graph-node:

```sh
yarn run create
yarn run deploy
```

### Querying Data

This example query fetches `Farming` data:

```graphql
query Farming {
  farming(id: "1") {
    poolCount
    totalStaked
    totalStakedUSD
    totalRewardsPaid
    totalRewardsPaidUSD
    coinUSDPrice
    gmiUSDPrice
    lpTokenUSDPrice
    chainId
    subgraphVersion
  }
}
```

This example query fetches `Pool` data:

```graphql
query Pools {
  pools(first: 5) {
    id
    lockingPeriodSeconds
    allocationPoints
    lpToken
    token0
    token1
    totalPoolStake
    totalPoolStakeUSD
    totalRewardsPaid
    totalRewardsPaidUSD
    createdAtBlockNumber
    createdAtTimestamp
  }
}
```

This example query fetches `PoolReward` data:

```graphql
query PoolRewards {
  poolRewards(first: 5) {
    id
    pool
    rewardsPerTokenPerSecond
    rewardsPerTokenPerSecondUSD
  }
}
```

This example query fetches `User` data:

```graphql
query Users {
  users(first: 5) {
    id
    stakes(first: 3) {
      id
    }
    withdrawals(first: 3) {
      id
    }
    rewardsReceived
    rewardsReceivedUSD
    createdAtTimestamp
    createdAtBlockNumber
  }
}
```

This example query fetches `FarmingReward` data:

```graphql
query FarmingRewards {
  farmingRewards(first: 5) {
    id
    user
    pool
    rewardsPaid
    rewardsPaidUSD
  }
}
```

This example query fetches `UserPoolStake` data:

```graphql
query UserPoolStakes {
  userPoolStakes(first: 5) {
    id
    pool
    user
    lockedUntilTimeStamp
    staked
    stakedUSD
  }
}
```

This example query fetches `UserPoolWithdrawal` data:

```graphql
query UserPoolWithdrawals {
  userPoolWithdrawals(first: 5) {
    id
    pool
    user
    withdrawn
    withdrawnUSD
  }
}
```

This example query fetches `DailyFarmingStatistic`:

```graphql
query DailyFarmingStatistics {
  dailyFarmingStatistics(first: 5) {
    id
    date
    stakedUSD
    withdrawnUSD
    rewardsPaid
    rewardsPaidUSD
    txns
  }
}
```

This example query fetches `DailyPoolStatistic`:

```graphql
query DailyPoolStatistics {
  dailyPoolStatistics(first: 5) {
    id
    date
    pool
    staked
    stakedUSD
    withdrawn
    withdrawnUSD
    rewardsPaid
    rewardsPaidUSD
    txns
  }
}
```

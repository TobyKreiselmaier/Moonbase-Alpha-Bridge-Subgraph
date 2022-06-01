import { BigInt } from '@graphprotocol/graph-ts'
import { DailyStatistic } from '../../generated/schema'
import { BI_0, BI_1, SECONDS_PER_DAY } from './helpers'

export function updateDailyStatistic(
  deposits: BigInt,
  proposals: BigInt,
  votes: BigInt,
  relayers: BigInt,
  timestamp: BigInt
): DailyStatistic {
  let dayID = timestamp.toI32() / SECONDS_PER_DAY
  let dayStartTimestamp = dayID * SECONDS_PER_DAY
  let dailyStatistic = DailyStatistic.load(dayID.toString()) as DailyStatistic | null
  if (!dailyStatistic) {
    dailyStatistic = new DailyStatistic(dayID.toString())
    dailyStatistic.date = dayStartTimestamp
    dailyStatistic.depositsCount = BI_0
    dailyStatistic.proposalsCount = BI_0
    dailyStatistic.votesCount = BI_0
    dailyStatistic.relayersCount = BI_0
  }
  dailyStatistic.depositsCount = (dailyStatistic.depositsCount as BigInt).plus(deposits)
  dailyStatistic.proposalsCount = (dailyStatistic.proposalsCount as BigInt).plus(proposals)
  dailyStatistic.votesCount = (dailyStatistic.votesCount as BigInt).plus(votes)
  dailyStatistic.relayersCount = (dailyStatistic.relayersCount as BigInt).plus(relayers)
  dailyStatistic.save()

  return dailyStatistic as DailyStatistic
}

import dayjs, { Dayjs } from 'dayjs'
import { Between, getConnection } from 'typeorm'
import { Day, Event, EventType } from '../database/model/event'

type Result = {
  id: number
  type: EventType
  date: Dayjs
  description: string
  changeTo?: Day
}
export async function getEventsUseCase(year: number): Promise<Result[]> {
  return getConnection()
    .getRepository(Event)
    .find({ date: Between(dayjs(`${year}-01-01`), dayjs(`${year}-12-31`)) })
}

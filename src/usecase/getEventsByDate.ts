import { Dayjs } from 'dayjs'
import { getConnection } from 'typeorm'
import { Day, Event, EventType } from '../database/model/event'
type Result = {
  id: number
  type: EventType
  date: Dayjs
  description: string
  changeTo?: Day
}
export async function getEventsByDateUseCase(date: Dayjs): Promise<Result[]> {
  return getConnection().getRepository(Event).find({ date: date })
}

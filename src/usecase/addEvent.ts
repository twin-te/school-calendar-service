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

export function addEventUseCase(
  date: Dayjs,
  type: EventType,
  description: string,
  changeTo?: Day
): Promise<Result> {
  return getConnection()
    .getRepository(Event)
    .save({ date, type, description, changeTo })
}

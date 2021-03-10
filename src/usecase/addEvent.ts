import { Dayjs } from 'dayjs'
import { getConnection } from 'typeorm'
import { Day, Event, EventType } from '../database/model/event'

export async function addEventUseCase(
  date: Dayjs,
  type: EventType,
  description: string,
  changeTo?: Day
) {
  await getConnection()
    .getRepository(Event)
    .save({ date, type, description, changeTo })
}

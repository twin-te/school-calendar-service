import dayjs, { Dayjs } from 'dayjs'
import { getConnection } from 'typeorm'
import { connectDatabase, disconnectDatabase } from '../../src/database'
import { Day, Event, EventType } from '../../src/database/model/event'
import { NotFoundError } from '../../src/error'
import { addEventUseCase } from '../../src/usecase/addEvent'
import { deleteEventUseCaes } from '../../src/usecase/deleteEvent'
import { clearDB } from '../_cleardb'

let data: {
  id: number
  type: EventType
  date: Dayjs
  description: string
  changeTo?: Day
}

beforeAll(async () => {
  await connectDatabase()
  await clearDB()
  data = await getConnection()
    .getRepository(Event)
    .save({
      type: EventType.SubstituteDay,
      date: dayjs('2021-04-01'),
      description: 'description',
      changeTo: Day.Mon,
    })
})

test('deleteEvent', () => {
  return expect(deleteEventUseCaes(data.id)).resolves.toBeUndefined()
})

test('deleteEvent notfound', () => {
  return expect(deleteEventUseCaes(data.id)).rejects.toThrow(NotFoundError)
})

afterAll(disconnectDatabase)

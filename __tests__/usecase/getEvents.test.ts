import dayjs from 'dayjs'
import { getConnection } from 'typeorm'
import { connectDatabase, disconnectDatabase } from '../../src/database'
import { Day, Event, EventType } from '../../src/database/model/event'
import { getEventsUseCase } from '../../src/usecase/getEvents'
import { clearDB } from '../_cleardb'
import { deepContaining } from '../_deepContaining'

const data = [
  {
    type: EventType.Holiday,
    date: dayjs('2021-04-01'),
    description: 'description',
  },
  {
    type: EventType.SubstituteDay,
    date: dayjs('2021-04-01'),
    description: 'description',
    changeTo: Day.Mon,
  },
]

beforeAll(async () => {
  await connectDatabase()
  await clearDB()
  await getConnection().getRepository(Event).save(data)
})

test('getEvents', () =>
  expect(getEventsUseCase(2021)).resolves.toEqual(deepContaining(data)))

test('getEvents', () => expect(getEventsUseCase(2020)).resolves.toEqual([]))

afterAll(disconnectDatabase)

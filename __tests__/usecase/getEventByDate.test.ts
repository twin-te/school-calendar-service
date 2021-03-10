import dayjs from 'dayjs'
import { getConnection } from 'typeorm'
import { connectDatabase, disconnectDatabase } from '../../src/database'
import { Day, Event, EventType } from '../../src/database/model/event'
import { getEventsByDateUseCase } from '../../src/usecase/getEventsByDate'
import { clearDB } from '../_cleardb'
import { deepContaining } from '../_deepContaining'
const data = [
  {
    type: EventType.Holiday,
    date: dayjs('2021-04-01'),
    description: 'description',
  },
  {
    type: EventType.PublicHoliday,
    date: dayjs('2021-04-02'),
    description: 'description',
  },
  {
    type: EventType.SubstituteDay,
    date: dayjs('2021-04-02'),
    description: 'description',
    changeTo: Day.Mon,
  },
]

beforeAll(async () => {
  await connectDatabase()
  await clearDB()
  await getConnection().getRepository(Event).save(data)
})

test('getEventsByDate', () =>
  expect(getEventsByDateUseCase(dayjs('2021-04-01'))).resolves.toEqual([
    data[0],
  ]))

test('getEventsByDate', async () => {
  const res = await getEventsByDateUseCase(dayjs('2021-04-02'))
  expect(res.length).toBe(2)
  expect(res).toEqual(deepContaining([data[1], data[2]]))
})

test('getEventsByDate', () =>
  expect(getEventsByDateUseCase(dayjs('2021-04-03'))).resolves.toEqual([]))

afterAll(disconnectDatabase)

import dayjs from 'dayjs'
import { connectDatabase, disconnectDatabase } from '../../src/database'
import { Day, EventType } from '../../src/database/model/event'
import { addEventUseCase } from '../../src/usecase/addEvent'
import { clearDB } from '../_cleardb'

beforeAll(async () => {
  await connectDatabase()
  await clearDB()
})

test('addEvent', () => {
  return expect(
    addEventUseCase(dayjs('2021-04-07'), EventType.PublicHoliday, 'description')
  ).resolves.toEqual({
    id: expect.any(Number),
    date: dayjs('2021-04-07'),
    type: EventType.PublicHoliday,
    description: 'description',
    changeTo: null,
  })
})

test('addEvent', () => {
  return expect(
    addEventUseCase(
      dayjs('2021-04-07'),
      EventType.SubstituteDay,
      'description',
      Day.Mon
    )
  ).resolves.toEqual({
    id: expect.any(Number),
    date: dayjs('2021-04-07'),
    type: EventType.SubstituteDay,
    description: 'description',
    changeTo: Day.Mon,
  })
})

afterAll(disconnectDatabase)

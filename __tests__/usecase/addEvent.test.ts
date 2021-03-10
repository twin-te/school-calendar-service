import dayjs from 'dayjs'
import { connectDatabase, disconnectDatabase } from '../../src/database'
import { Day, EventType } from '../../src/database/model/event'
import { addEventUseCase } from '../../src/usecase/addEvent'
import { clearDB } from '../_cleardb'

beforeAll(async () => {
  await connectDatabase()
  await clearDB()
})

test('setModule', () => {
  return expect(
    addEventUseCase(dayjs('2021-04-07'), EventType.PublicHoliday, 'description')
  ).resolves.toBeUndefined()
})

test('setModule', () => {
  return expect(
    addEventUseCase(
      dayjs('2021-04-07'),
      EventType.SubstituteDay,
      'description',
      Day.Mon
    )
  ).resolves.toBeUndefined()
})

afterAll(disconnectDatabase)

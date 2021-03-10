import dayjs from 'dayjs'
import { connectDatabase, disconnectDatabase } from '../../src/database'
import { ModuleEnum } from '../../src/database/model/module'
import { setModuleTermUseCase } from '../../src/usecase/setModuleTerm'
import { clearDB } from '../_cleardb'

beforeAll(async () => {
  await connectDatabase()
  await clearDB()
})

test('setModule', () => {
  return expect(
    setModuleTermUseCase(
      2021,
      ModuleEnum.SpringA,
      dayjs('2021-04-01'),
      dayjs('2021-06-30')
    )
  ).resolves.toBeUndefined()
})

test('setModule', () => {
  return expect(
    setModuleTermUseCase(
      2021,
      ModuleEnum.SpringA,
      dayjs('2021-04-01'),
      dayjs('2021-05-30')
    )
  ).resolves.toBeUndefined()
})

afterAll(disconnectDatabase)

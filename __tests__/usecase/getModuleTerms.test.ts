import dayjs from 'dayjs'
import { getConnection } from 'typeorm'
import { connectDatabase, disconnectDatabase } from '../../src/database'
import { Module, ModuleEnum } from '../../src/database/model/module'
import { getModuleTermsUseCase } from '../../src/usecase/getModuleTerms'
import { setModuleTermUseCase } from '../../src/usecase/setModuleTerm'
import { clearDB } from '../_cleardb'
import { deepContaining } from '../_deepContaining'

const data = [
  {
    year: 2021,
    module: ModuleEnum.SpringA,
    start: dayjs('2021-04-01'),
    end: dayjs('2021-05-30'),
  },
  {
    year: 2021,
    module: ModuleEnum.SpringB,
    start: dayjs('2021-06-01'),
    end: dayjs('2021-06-30'),
  },
  {
    year: 2021,
    module: ModuleEnum.SpringC,
    start: dayjs('2021-07-01'),
    end: dayjs('2021-07-30'),
  },
]

beforeAll(async () => {
  await connectDatabase()
  await clearDB()
  await getConnection().getRepository(Module).save(data)
})

test('getModule', () =>
  expect(getModuleTermsUseCase(2021)).resolves.toEqual(deepContaining(data)))

test('getModule', () =>
  expect(getModuleTermsUseCase(2020)).resolves.toEqual([]))

afterAll(disconnectDatabase)

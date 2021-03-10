import dayjs from 'dayjs'
import { getConnection } from 'typeorm'
import { connectDatabase, disconnectDatabase } from '../../src/database'
import { Module, ModuleEnum } from '../../src/database/model/module'
import { getModuleTermByDateUseCase } from '../../src/usecase/getModuleTermByDate'
import { getModuleTermsUseCase } from '../../src/usecase/getModuleTerms'
import { clearDB } from '../_cleardb'

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

test('モジュール開始日', () =>
  expect(getModuleTermByDateUseCase(dayjs('2021-04-01'))).resolves.toEqual(
    data[0]
  ))

test('モジュール期間中', () =>
  expect(getModuleTermByDateUseCase(dayjs('2021-04-15'))).resolves.toEqual(
    data[0]
  ))

test('モジュール最終日', () =>
  expect(getModuleTermByDateUseCase(dayjs('2021-05-30'))).resolves.toEqual(
    data[0]
  ))

test('モジュール開始日', () =>
  expect(getModuleTermByDateUseCase(dayjs('2021-06-01'))).resolves.toEqual(
    data[1]
  ))

test('モジュール期間中', () =>
  expect(getModuleTermByDateUseCase(dayjs('2021-06-15'))).resolves.toEqual(
    data[1]
  ))

test('モジュール最終日', () =>
  expect(getModuleTermByDateUseCase(dayjs('2021-06-30'))).resolves.toEqual(
    data[1]
  ))

test('どのモジュール期間でもない場合', () =>
  expect(
    getModuleTermByDateUseCase(dayjs('2021-08-01'))
  ).resolves.toBeUndefined())

afterAll(disconnectDatabase)

import { Dayjs } from 'dayjs'
import { getConnection, LessThanOrEqual, MoreThanOrEqual } from 'typeorm'
import { Module, ModuleEnum } from '../database/model/module'

type Result = {
  id: number
  year: number
  module: ModuleEnum
  start: Dayjs
  end: Dayjs
}

export function getModuleTermByDateUseCase(
  date: Dayjs
): Promise<Result | undefined> {
  return getConnection()
    .getRepository(Module)
    .findOne({ start: LessThanOrEqual(date), end: MoreThanOrEqual(date) })
}

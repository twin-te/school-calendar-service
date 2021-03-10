import { Dayjs } from 'dayjs'
import { getConnection } from 'typeorm'
import { Module, ModuleEnum } from '../database/model/module'

type Result = {
  id: number
  year: number
  module: ModuleEnum
  start: Dayjs
  end: Dayjs
}

export async function getModuleTermsUseCase(year: number): Promise<Result[]> {
  return getConnection().getRepository(Module).find({ year })
}

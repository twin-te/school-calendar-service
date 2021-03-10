import { Dayjs } from 'dayjs'
import { getConnection } from 'typeorm'
import { Module, ModuleEnum } from '../database/model/module'

export async function setModuleTermUseCase(
  year: number,
  module: ModuleEnum,
  start: Dayjs,
  end: Dayjs
) {
  const repo = getConnection().getRepository(Module)
  let target = await repo.findOne({ year, module })
  if (target) {
    target.start = start
    target.end = end
  } else {
    target = repo.create({ year, module, start, end })
  }
  await repo.save(target)
}

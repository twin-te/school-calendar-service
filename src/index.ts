import { connectDatabase } from './database'
import { startGrpcServer } from './grpc'
import { logger } from './logger'
import { getEventsUseCase } from './usecase/getEvents'
import fs from 'fs'
import { addEventUseCase } from './usecase/addEvent'
import dayjs, { Dayjs } from 'dayjs'
import { getModuleTermsUseCase } from './usecase/getModuleTerms'
import { setModuleTermUseCase } from './usecase/setModuleTerm'
import { ModuleEnum } from './database/model/module'
import { Day, EventType } from './database/model/event'

// TODO 後で消す
async function importEventsIfNotExist(year: number) {
  if ((await getEventsUseCase(year)).length === 0) {
    logger.info(`importing events${year}.json...`)
    const data = JSON.parse(
      fs.readFileSync(`./school-calendar/events${year}.json`, 'utf-8')
    ) as {
      type: keyof typeof EventType
      date: string
      description: string
      changeTo?: keyof typeof Day
    }[]
    await Promise.all(
      data.map((d) =>
        addEventUseCase(
          dayjs(d.date),
          Object.keys(EventType).indexOf(d.type) - 5,
          d.description,
          d.changeTo ? Object.keys(Day).indexOf(d.changeTo) - 7 : undefined
        )
      )
    )
  }
}

// TODO 後で消す
async function importModuleIfNotExist(year: number) {
  logger.info(`importing module${year}.json...`)
  if ((await getModuleTermsUseCase(year)).length === 0) {
    const data = JSON.parse(
      fs.readFileSync('./school-calendar/module2021.json', 'utf-8')
    ) as {
      year: number
      module: keyof typeof ModuleEnum
      start: string
      end: string
    }[]
    await Promise.all(
      data.map((d) =>
        setModuleTermUseCase(
          d.year,
          Object.keys(ModuleEnum).indexOf(d.module) - 8,
          dayjs(d.start),
          dayjs(d.end)
        )
      )
    )
  }
}

async function main() {
  logger.info('starting...')
  await connectDatabase()
  await startGrpcServer()

  // TODO 後で消す
  await importModuleIfNotExist(2020)
  await importModuleIfNotExist(2021)
  await importEventsIfNotExist(2020)
  await importEventsIfNotExist(2021)
  logger.info('Ready')
}

main()

import { startGrpcServer, stopGrpcServer } from '../../src/grpc'
import * as protoLoader from '@grpc/proto-loader'
import path from 'path'
import * as grpc from '@grpc/grpc-js'
import {
  Day as GrpcDay,
  EventType as GrpcEventType,
  Module as GrpcModule,
  SchoolCalendarService,
} from '../../generated'
import { ServiceClientConstructor } from '@grpc/grpc-js/build/src/make-client'
import { GrpcClient } from '../../src/grpc/type'
import { Status } from '@grpc/grpc-js/build/src/constants'
import dayjs from 'dayjs'
import { deepContaining } from '../_deepContaining'
import { addEventUseCase } from '../../src/usecase/addEvent'
import { mocked } from 'ts-jest/utils'
import { deleteEventUseCaes } from '../../src/usecase/deleteEvent'
import { NotFoundError } from '../../src/error'
import { getEventsUseCase } from '../../src/usecase/getEvents'
import { Day, EventType } from '../../src/database/model/event'
import { getEventsByDateUseCase } from '../../src/usecase/getEventsByDate'
import { getModuleTermByDateUseCase } from '../../src/usecase/getModuleTermByDate'
import { Module, ModuleEnum } from '../../src/database/model/module'
import { getModuleTermsUseCase } from '../../src/usecase/getModuleTerms'
import { setModuleTermUseCase } from '../../src/usecase/setModuleTerm'
jest.mock('../../src/usecase/addEvent')
jest.mock('../../src/usecase/deleteEvent')
jest.mock('../../src/usecase/getEvents')
jest.mock('../../src/usecase/getEventsByDate')
jest.mock('../../src/usecase/getModuleTermByDate')
jest.mock('../../src/usecase/getModuleTerms')
jest.mock('../../src/usecase/setModuleTerm')

const def = protoLoader.loadSync(
  path.resolve(__dirname, `../../protos/SchoolCalendarService.proto`),
  { defaults: true }
)
const pkg = grpc.loadPackageDefinition(def)
const ClientConstructor = pkg.SchoolCalendarService as ServiceClientConstructor
let client: GrpcClient<SchoolCalendarService>

beforeAll(async () => {
  await startGrpcServer()
  client = (new ClientConstructor(
    'localhost:50051',
    grpc.ChannelCredentials.createInsecure()
  ) as unknown) as GrpcClient<SchoolCalendarService>
})

describe('addEvent', () => {
  const data = {
    type: GrpcEventType.SubstituteDay,
    date: dayjs('2021-04-15').toISOString(),
    description: 'description',
    changeTo: GrpcDay.Mon,
  }
  test('success', (done) => {
    mocked(addEventUseCase).mockImplementation(
      async (date, type, description, changeTo) => {
        expect(date.toISOString()).toEqual(data.date)
        expect(type).toEqual(EventType.SubstituteDay)
        expect(description).toEqual(description)
        expect(changeTo).toEqual(data.changeTo)
        return {
          id: 1,
          date,
          type,
          description,
          changeTo,
        }
      }
    )
    client.addEvent(data, (err, res) => {
      expect(err).toBeNull()
      expect(res).toEqual(deepContaining(data))
      done()
    })
  })
  test('failure', (done) => {
    mocked(addEventUseCase).mockImplementation(() => {
      throw new Error('Unexpected Error!')
    })
    client.addEvent(data, (err, res) => {
      expect(err).toBeTruthy()
      expect(err?.code).toEqual(Status.UNKNOWN)
      done()
    })
  })
})

describe('deleteEvent', () => {
  test('success', (done) => {
    mocked(deleteEventUseCaes).mockImplementation(async (id) => {
      expect(id).toEqual(1)
    })
    client.deleteEvent({ id: 1 }, (err, res) => {
      expect(err).toBeNull()
      done()
    })
  })
  test('not found', (done) => {
    mocked(deleteEventUseCaes).mockImplementation(async (id) => {
      throw new NotFoundError('指定されたイベントは見つかりませんでした')
    })
    client.deleteEvent({ id: 1 }, (err, res) => {
      expect(err?.code).toEqual(Status.NOT_FOUND)
      done()
    })
  })
})

describe('getEvents', () => {
  const data = [
    {
      id: 1,
      type: EventType.SubstituteDay,
      date: dayjs('2021-04-15'),
      description: 'description',
      changeTo: Day.Mon,
    },
    {
      id: 2,
      type: EventType.Holiday,
      date: dayjs('2021-04-20'),
      description: 'description',
    },
  ]
  test('success', (done) => {
    mocked(getEventsUseCase).mockImplementation(async (year) => {
      expect(year).toEqual(2021)
      return data
    })
    client.getEvents({ year: 2021 }, (err, res) => {
      expect(err).toBeNull()
      expect(res?.events).toEqual(
        deepContaining(
          data.map(({ date, changeTo, ...d }) => ({
            ...d,
            date: date.toISOString(),
            changeTo: changeTo ?? GrpcDay.Sun,
          }))
        )
      )
      done()
    })
  })
  test('failure', (done) => {
    mocked(getEventsUseCase).mockImplementation(async () => {
      throw new Error('Unexpected error!')
    })
    client.getEvents({ year: 2021 }, (err, res) => {
      expect(err?.code).toEqual(Status.UNKNOWN)
      done()
    })
  })
})

describe('getEventsByDate', () => {
  const data = [
    {
      id: 1,
      type: EventType.SubstituteDay,
      date: dayjs('2021-04-15'),
      description: 'description',
      changeTo: Day.Mon,
    },
    {
      id: 2,
      type: EventType.Holiday,
      date: dayjs('2021-04-20'),
      description: 'description',
    },
  ]
  test('success', (done) => {
    mocked(getEventsByDateUseCase).mockImplementation(async (date) => {
      expect(date).toEqual(dayjs('2020-04-15'))
      return [data[0]]
    })
    client.getEventsByDate(
      { date: dayjs('2020-04-15').toISOString() },
      (err, res) => {
        expect(err).toBeNull()
        expect(res?.events).toEqual([
          { ...data[0], date: data[0].date.toISOString() },
        ])
        done()
      }
    )
  })
  test('empty', (done) => {
    mocked(getEventsByDateUseCase).mockImplementation(async (date) => {
      expect(date).toEqual(dayjs('2021-04-15'))
      return []
    })
    client.getEventsByDate(
      { date: dayjs('2021-04-15').toISOString() },
      (err, res) => {
        expect(err).toBeNull()
        expect(res?.events).toEqual([])
        done()
      }
    )
  })
  test('failure', (done) => {
    mocked(getEventsByDateUseCase).mockImplementation(async () => {
      throw new Error('Unexpected error!')
    })
    client.getEventsByDate(
      { date: dayjs('2021-04-15').toISOString() },
      (err, res) => {
        expect(err?.code).toEqual(Status.UNKNOWN)
        done()
      }
    )
  })
})

describe('getModuleTermByDate', () => {
  const data = {
    id: 1,
    year: 2021,
    module: ModuleEnum.SpringA,
    start: dayjs('2021-04-01'),
    end: dayjs('2021-04-30'),
  }
  test('success', (done) => {
    mocked(getModuleTermByDateUseCase).mockImplementation(async (date) => {
      expect(date).toEqual(dayjs('2021-04-15'))
      return data
    })
    client.getModuleTermByDate(
      { date: dayjs('2021-04-15').toISOString() },
      (err, res) => {
        expect(err).toBeNull()
        expect(res).toEqual({
          ...data,
          start: data.start.toISOString(),
          end: data.end.toISOString(),
        })
        done()
      }
    )
  })
  test('not found', (done) => {
    mocked(getModuleTermByDateUseCase).mockImplementation(async (date) => {
      expect(date).toEqual(dayjs('2021-04-15'))
      throw new NotFoundError('指定された日時のモジュールデータは存在しません')
    })
    client.getModuleTermByDate(
      { date: dayjs('2021-04-15').toISOString() },
      (err, res) => {
        expect(err?.code).toEqual(Status.NOT_FOUND)
        done()
      }
    )
  })
})

describe('getModuleTerms', () => {
  const data = [
    {
      id: 1,
      year: 2021,
      module: ModuleEnum.SpringA,
      start: dayjs('2021-04-01'),
      end: dayjs('2021-04-30'),
    },
    {
      id: 2,
      year: 2021,
      module: ModuleEnum.SpringB,
      start: dayjs('2021-05-01'),
      end: dayjs('2021-05-30'),
    },
    {
      id: 3,
      year: 2021,
      module: ModuleEnum.SpringC,
      start: dayjs('2021-06-01'),
      end: dayjs('2021-07-30'),
    },
  ]
  test('success', (done) => {
    mocked(getModuleTermsUseCase).mockImplementation(async (year) => {
      expect(year).toEqual(2021)
      return data
    })
    client.getModuleTerms({ year: 2021 }, (err, res) => {
      expect(err).toBeNull()
      expect(res?.terms).toEqual(
        deepContaining(
          data.map(({ start, end, ...d }) => ({
            ...d,
            start: start.toISOString(),
            end: end.toISOString(),
          }))
        )
      )
      done()
    })
  })
  test('empty', (done) => {
    mocked(getModuleTermsUseCase).mockImplementation(async (year) => {
      expect(year).toEqual(2021)
      return []
    })
    client.getModuleTerms({ year: 2021 }, (err, res) => {
      expect(err).toBeNull()
      expect(res?.terms).toEqual([])
      done()
    })
  })
  test('failure', (done) => {
    mocked(getModuleTermsUseCase).mockImplementation(async (year) => {
      expect(year).toEqual(2021)
      throw new Error('Unexpected Error!')
    })
    client.getModuleTerms({ year: 2021 }, (err, res) => {
      expect(err?.code).toEqual(Status.UNKNOWN)
      done()
    })
  })
})

describe('setModuleTerm', () => {
  const data = {
    year: 2021,
    module: GrpcModule.SpringA,
    start: dayjs('2021-04-01').toISOString(),
    end: dayjs('2021-04-30').toISOString(),
  }
  test('success', (done) => {
    mocked(setModuleTermUseCase).mockImplementation(
      async (year, module, start, end) => {
        expect(year).toEqual(data.year)
        expect(module).toEqual(data.module)
        expect(start.toISOString()).toEqual(data.start)
        expect(end.toISOString()).toEqual(data.end)
      }
    )
    client.setModuleTerm(data, (err, res) => {
      expect(err).toBeNull()
      done()
    })
  })
  test('failure', (done) => {
    mocked(setModuleTermUseCase).mockImplementation(async () => {
      throw new Error('Unexpected error!')
    })
    client.setModuleTerm(data, (err, res) => {
      expect(err?.code).toEqual(Status.UNKNOWN)
      done()
    })
  })
})

afterAll(stopGrpcServer)

import { Status } from '@grpc/grpc-js/build/src/constants'
import dayjs from 'dayjs'
import {
  EmptyResponse,
  Event,
  GetEventsResponse,
  GetModuleTermsResponse,
  ModuleTerm,
  SchoolCalendarService,
} from '../../generated'
import { ModuleEnum } from '../database/model/module'
import { addEventUseCase } from '../usecase/addEvent'
import { deleteEventUseCaes } from '../usecase/deleteEvent'
import { getEventsUseCase } from '../usecase/getEvents'
import { getEventsByDateUseCase } from '../usecase/getEventsByDate'
import { getModuleTermByDateUseCase } from '../usecase/getModuleTermByDate'
import { getModuleTermsUseCase } from '../usecase/getModuleTerms'
import { setModuleTermUseCase } from '../usecase/setModuleTerm'
import { toGrpcError, toGrpcEvent, toGrpcModuleTerm } from './converter'
import { GrpcServer } from './type'

export const schoolCalendarService: GrpcServer<SchoolCalendarService> = {
  async addEvent({ request }, callback) {
    try {
      const res = await addEventUseCase(
        dayjs(request.date),
        request.type,
        request.description,
        request.changeTo
      )
      callback(
        null,
        Event.create({
          ...res,
          date: res.date.toISOString(),
        })
      )
    } catch (e) {
      callback(toGrpcError(e))
    }
  },
  async deleteEvent({ request }, callback) {
    try {
      await deleteEventUseCaes(request.id)
      callback(null, EmptyResponse.create())
    } catch (e) {
      callback(toGrpcError(e))
    }
  },
  async getEvents({ request }, callback) {
    try {
      const res = await getEventsUseCase(request.year)
      callback(null, GetEventsResponse.create({ events: res.map(toGrpcEvent) }))
    } catch (e) {
      callback(toGrpcError(e))
    }
  },
  async getEventsByDate({ request }, callback) {
    try {
      const res = await getEventsByDateUseCase(dayjs(request.date))
      callback(null, GetEventsResponse.create({ events: res.map(toGrpcEvent) }))
    } catch (e) {
      callback(toGrpcError(e))
    }
  },
  async getModuleTermByDate({ request }, callback) {
    try {
      const res = await getModuleTermByDateUseCase(dayjs(request.date))
      if (!res)
        callback({
          code: Status.NOT_FOUND,
          details: '指定された日時のモジュールデータは存在しません',
        })
      else callback(null, ModuleTerm.create(toGrpcModuleTerm(res)))
    } catch (e) {
      callback(toGrpcError(e))
    }
  },
  async getModuleTerms({ request }, callback) {
    try {
      const res = await getModuleTermsUseCase(request.year)
      if (!res)
        callback({
          code: Status.NOT_FOUND,
          details: '指定された日時のモジュールデータは存在しません',
        })
      else
        callback(
          null,
          GetModuleTermsResponse.create({ terms: res.map(toGrpcModuleTerm) })
        )
    } catch (e) {
      callback(toGrpcError(e))
    }
  },
  async setModuleTerm({ request }, callback) {
    try {
      await setModuleTermUseCase(
        request.year,
        (request.module as unknown) as ModuleEnum,
        dayjs(request.start),
        dayjs(request.end)
      )
      callback(null, EmptyResponse.create())
    } catch (e) {
      callback(toGrpcError(e))
    }
  },
}

import { StatusObject, Metadata } from '@grpc/grpc-js'
import { Status } from '@grpc/grpc-js/build/src/constants'
import { ServerErrorResponse } from '@grpc/grpc-js/build/src/server-call'
import { Day, Event } from '../database/model/event'
import {
  IEvent as GrpcEvent,
  Day as GrpcDay,
  IModuleTerm as GrpcModuleTerm,
  Module as GrpcModule,
} from '../../generated/index'

import {
  NotFoundError,
  InvalidArgumentError,
  AlreadyExistError,
} from '../error'
import { Module, ModuleEnum } from '../database/model/module'

export function toGrpcError(
  e: Error
): Partial<StatusObject> | ServerErrorResponse {
  if (e instanceof NotFoundError)
    return Object.assign(e, {
      code: Status.NOT_FOUND,
      metadata: makeMetadata({ resources: e.resources }),
    })
  else if (e instanceof InvalidArgumentError)
    return Object.assign(e, {
      code: Status.INVALID_ARGUMENT,
      metadata: makeMetadata({ args: e.args }),
    })
  else if (e instanceof AlreadyExistError)
    return Object.assign(e, {
      code: Status.ALREADY_EXISTS,
    })
  else return Object.assign(e, { code: Status.UNKNOWN })
}

function makeMetadata(obj: any): Metadata {
  const metadata = new Metadata()
  Object.keys(obj).forEach((k) => metadata.add(k, obj[k]))
  return metadata
}

export function toGrpcEvent(e: Event): GrpcEvent {
  return {
    id: e.id,
    date: e.date.toISOString(),
    type: e.type,
    description: e.description,
    changeTo: e.changeTo,
  }
}

export function toGrpcModuleTerm(m: Module): GrpcModuleTerm {
  return {
    id: m.id,
    year: m.year,
    module: Object.keys(ModuleEnum).indexOf(ModuleEnum[m.module]),
    start: m.start.toISOString(),
    end: m.end.toISOString(),
  }
}

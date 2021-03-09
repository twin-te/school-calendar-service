import * as grpc from '@grpc/grpc-js'
import { ServiceClientConstructor } from '@grpc/grpc-js/build/src/make-client'
import * as protoLoader from '@grpc/proto-loader'
import path from 'path'
import { logger } from '../logger'
import { applyLogger } from './logger'
import { schoolCalendarService } from './schoolCalendar.service'

const protoPath = path.resolve(
  __dirname,
  `../../protos/SchoolCalendarService.proto`
)
const serviceName = 'SchoolCalendarService'

let server: grpc.Server | undefined

const def = protoLoader.loadSync(protoPath, { defaults: true })
const serviceDef = (grpc.loadPackageDefinition(def)[
  serviceName
] as ServiceClientConstructor).service

/**
 * grpcServer開始
 */
export async function startGrpcServer() {
  return new Promise<void>((resolve, reject) => {
    if (server) reject(new Error('already started'))
    server = new grpc.Server()
    server.addService(serviceDef, applyLogger(schoolCalendarService))
    server.bindAsync(
      '0.0.0.0:50051',
      grpc.ServerCredentials.createInsecure(),
      (err) => {
        if (err) reject(err)
        else {
          server!.start()
          logger.info('grpc server started.')
          resolve()
        }
      }
    )
  })
}

/**
 * grpcServer停止
 */
export async function stopGrpcServer() {
  return new Promise<void>((resolve, reject) => {
    if (!server) throw new Error('not started')
    server.tryShutdown((err) => {
      if (err) reject(err)
      else resolve()
    })
  })
}

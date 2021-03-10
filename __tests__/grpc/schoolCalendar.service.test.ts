import { startGrpcServer, stopGrpcServer } from '../../src/grpc'
import * as protoLoader from '@grpc/proto-loader'
import path from 'path'
import * as grpc from '@grpc/grpc-js'
import { SchoolCalendarService } from '../../generated'
import { ServiceClientConstructor } from '@grpc/grpc-js/build/src/make-client'
import { GrpcClient } from '../../src/grpc/type'
import { Status } from '@grpc/grpc-js/build/src/constants'

const def = protoLoader.loadSync(
  path.resolve(__dirname, `../../protos/SchoolCalendarService.proto`)
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

test('greeting success', (done) => {
  const name = 'Twin:te'
  client.greet({ name }, (err, res) => {
    expect(err).toBeNull()
    expect(res?.text).toEqual(`hello! ${name}`)
    done()
  })
})

test('empty name', (done) => {
  const name = ''
  client.greet({ name }, (err, res) => {
    expect(err?.code).toBe(Status.INVALID_ARGUMENT)
    done()
  })
})

afterAll(stopGrpcServer)
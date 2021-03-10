import { getConnection } from 'typeorm'
import { Event } from '../src/database/model/event'
import { Module } from '../src/database/model/module'

export async function clearDB() {
  await getConnection().getRepository(Module).delete({})
  await getConnection().getRepository(Event).delete({})
}

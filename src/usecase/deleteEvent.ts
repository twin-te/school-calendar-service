import { getConnection } from 'typeorm'
import { Event } from '../database/model/event'
import { NotFoundError } from '../error'

export async function deleteEventUseCaes(id: number) {
  const res = await getConnection().getRepository(Event).delete(id)
  if (res.affected === 0)
    throw new NotFoundError('指定されたイベントは見つかりませんでした')
}

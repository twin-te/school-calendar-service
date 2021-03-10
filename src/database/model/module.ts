import dayjs, { Dayjs } from 'dayjs'
import {
  Column,
  Entity,
  FindOperator,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm'

export enum ModuleEnum {
  SpringA,
  SpringB,
  SpringC,
  SummerVacation,
  FallA,
  FallB,
  FallC,
  SpringVacation,
}

@Entity({
  name: 'modules',
})
@Index(['year', 'module'], { unique: true })
export class Module {
  @PrimaryGeneratedColumn({
    name: 'id',
    type: 'integer',
  })
  id!: number

  @Column({
    name: 'year',
    type: 'smallint',
  })
  year!: number

  @Column({
    name: 'module',
    type: 'enum',
    enum: ModuleEnum,
  })
  module!: ModuleEnum

  @Column({
    name: 'start',
    type: 'date',
    transformer: {
      // https://github.com/typeorm/typeorm/issues/2390
      to: (date: Dayjs | FindOperator<Dayjs>) =>
        date instanceof FindOperator ? date : date.toISOString(),
      from: (date: string) => dayjs(date),
    },
  })
  start!: Dayjs

  @Column({
    name: 'end',
    type: 'date',
    transformer: {
      // https://github.com/typeorm/typeorm/issues/2390
      to: (date: Dayjs | FindOperator<Dayjs>) =>
        date instanceof FindOperator ? date : date.toISOString(),
      from: (date: string) => dayjs(date),
    },
  })
  end!: Dayjs
}

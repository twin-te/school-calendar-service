import dayjs, { Dayjs } from 'dayjs'
import { Column, Entity, FindOperator, PrimaryGeneratedColumn } from 'typeorm'

export enum EventType {
  Holiday,
  PublicHoliday,
  Exam,
  SubstituteDay,
}

export enum Day {
  Sun,
  Mon,
  Tue,
  Wed,
  Thu,
  Fri,
  Sat,
}

@Entity({
  name: 'events',
})
export class Event {
  @PrimaryGeneratedColumn({
    name: 'id',
    type: 'integer',
  })
  id!: number

  @Column({
    name: 'type',
    type: 'enum',
    enum: EventType,
  })
  type!: EventType

  @Column({
    name: 'date',
    type: 'date',
    transformer: {
      // https://github.com/typeorm/typeorm/issues/2390
      to: (date: Dayjs | FindOperator<Dayjs>) =>
        date instanceof FindOperator ? date : date.toISOString(),
      from: (date: string) => dayjs(date),
    },
  })
  date!: Dayjs

  @Column({
    name: 'description',
    type: 'text',
  })
  description!: string

  @Column({
    name: 'change_to',
    nullable: true,
    type: 'enum',
    enum: Day,
  })
  changeTo?: Day
}

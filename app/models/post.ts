import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, computed } from '@adonisjs/lucid/orm'
import User from "#models/user"
import * as relations from '@adonisjs/lucid/types/relations'
import { compose } from '@adonisjs/core/helpers'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'

export default class Post extends compose(BaseModel, SoftDeletes)  {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare userId: string

  @column()
  declare title: string

  @column()
  declare content: string

  @column()
  declare isPublished: boolean

  @column()
  declare slug: string

  @column()
  declare image: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime()
  declare deletedAt: DateTime | null

  @computed()
  get imageUrl(): string | null {
    if (this.image) {
      return `http://localhost:3333/uploads/${this.image}`
    }
    return null
  }


  @belongsTo(() => User)
  declare user: relations.BelongsTo<typeof User>
}

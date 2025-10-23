import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, computed, hasMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import * as relations from '@adonisjs/lucid/types/relations'
import Post from "#models/post"
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder, SoftDeletes) {

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare username: string | null

  @column()
  declare fullName: string | null

  @column()
  declare email: string

  @column()
  declare phoneNumber: string | null

  @column()
  declare avatar: string | null


  @column({ serializeAs: null })
  declare password: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @column.dateTime()
  declare deletedAt: DateTime | null

  static accessTokens = DbAccessTokensProvider.forModel(User)

  @computed()
  get avatarUrl(): string | null {
    if (this.avatar) {
      return `http://localhost:3333/uploads/${this.avatar}`
    }
    return null
  }

  @hasMany(() => Post)
  declare posts: relations.HasMany<typeof Post>

}

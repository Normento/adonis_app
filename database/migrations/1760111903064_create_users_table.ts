import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    await this.raw(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp" schema pg_catalog version "1.1";`)
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('uuid_generate_v4()').knexQuery)
      table.string('full_name').nullable()
      table.string('username', 254).nullable().unique()
      table.string('email', 254).notNullable().unique()
      table.string('password').notNullable()
      table.string('phone_number').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
      table.timestamp('deleted_at').nullable()
      table.uuid('deleted_by').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

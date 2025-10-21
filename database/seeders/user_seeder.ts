import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { faker } from '@faker-js/faker'

export default class extends BaseSeeder {
  async run() {
    for (let i = 0; i < 10; i++) {
      await User.create({
        email: faker.internet.email(),
        fullName: faker.person.fullName(),
        username: faker.person.lastName().toLowerCase() + faker.number.int({ min: 1, max: 1000 }).toString(),
        password: await hash.make('password'),
      })
    }
  }
}

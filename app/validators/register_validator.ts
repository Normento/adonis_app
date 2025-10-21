import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim().minLength(3),
    username: vine.string().trim().minLength(3).unique({
      table: 'users',
      column: 'username',
    }),
    email: vine.string().trim().email().unique({
      table: 'users',
      column: 'email',
    }),
    password: vine.string().minLength(8),
    phoneNumber: vine.string().trim().optional(),
  })
)

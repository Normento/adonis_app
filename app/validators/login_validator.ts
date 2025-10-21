import vine from '@vinejs/vine'

export const LoginValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email().exists({
      table: 'users',
      column: 'email',
    }),
    password: vine.string().minLength(8),
  })
)

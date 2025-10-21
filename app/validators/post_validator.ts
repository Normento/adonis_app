import vine from '@vinejs/vine'

/**
 * Validator to validate the payload when creating
 * a new post.
 */
export const createPostValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(3),
    content: vine.string().trim().minLength(10),
    isPublished: vine.boolean().optional(),
  })
)

/**
 * Validator to validate the payload when updating
 * an existing post.
 */
export const updatePostValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(3).optional(),
    content: vine.string().trim().minLength(10).optional(),
    isPublished: vine.boolean().optional(),
  })
)

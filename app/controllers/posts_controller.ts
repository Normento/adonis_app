import Post from '#models/post'
import { createPostValidator } from '#validators/post_validator'
import { cuid } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'

export default class PostsController {
  /**
   * Display a list of resource
   */
  async index({}: HttpContext) {
    const posts = await Post.query().preload('user').paginate(1,3)
    return {
      data: posts.toJSON(),
    }
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, auth }: HttpContext) {
    const payload = await request.validateUsing(createPostValidator)
    const image = request.file('image')
    let key: string | null = null
    if (image) {
      key = `images/${cuid()}.${image.extname}`
      await image.moveToDisk(key,'fs', { overwrite: true })
    }
    const slugBase = this.generateSlug(payload.title)
    let slug = slugBase
    let count = 1
    while (await Post.query().where('slug', slug).first()) {
      slug = `${slugBase}-${count++}`
    }
    const post = await Post.create({...payload, image: key, slug : slug, userId: auth.user!.id })
    await post.load('user')

    return {
      data: { ...post.toJSON() },
      message: 'Post created successfully',
    }

  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    const post = await Post.query().where('slug', params.slug).firstOrFail()
    await post.load('user')
    return {
      data: post.toJSON(),
    }
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {
    const payload = await request.validateUsing(createPostValidator)
    const image = request.file('image')
    let key: string | null = null
    if (image) {
      key = `images/${cuid()}.${image.extname}`
      await image.moveToDisk(key,'fs', { overwrite: true })
    }
    const post = await Post.findOrFail(params.id)
    await post.merge({ ...payload, image: key }).save()
    await post.load('user')
    return {
      data: post.toJSON(),
      message: 'Post updated successfully',
    }
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {
    const post = await Post.findOrFail(params.id)
    await post.delete()
    return {
      message: 'Post deleted successfully',
    }
  }


  private generateSlug(title: string): string {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }
}

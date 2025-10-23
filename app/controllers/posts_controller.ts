import PostCreatedMail from '#mails/post_created_mail'
import Post from '#models/post'
import { createPostValidator } from '#validators/post_validator'
import { cuid } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'
import mail from '@adonisjs/mail/services/main'
import { bind } from '@adonisjs/route-model-binding'



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
    const post = await Post.create({...payload, image: key, slug : slug, userId: auth.user?.id })
    await post.load('user')
    //send mail to user about post creation
    // await mail.sendLater((message) => {
    //   message
    //     .to(auth.user?.email!)
    //     .subject('Post Created Successfully')
    //     .htmlView('emails/post_created', { user: auth.user, post })
    // })

    await mail.sendLater(new PostCreatedMail(auth.user, post))

    return {
      data: { ...post.toJSON() },
      message: 'Post created successfully',
    }

  }

  /**
   * Show individual record
   */
  @bind()
  async show({}, post : Post) {
    //const post = await Post.query().where('slug', params.slug).firstOrFail()
    await post.load('user')
    return {
      data: post.toJSON(),
    }
  }

  /**
   * Handle form submission for the edit action
   */
  @bind()
  async update({ request }: HttpContext, post: Post) {
    const payload = await request.validateUsing(createPostValidator)
    const image = request.file('image')
    let key: string | null = null
    if (image) {
      key = `images/${cuid()}.${image.extname}`
      await image.moveToDisk(key,'fs', { overwrite: true })
    }
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
  @bind()
  async destroy({}, post: Post) {
    await post.delete()
    return {
      message: 'Post deleted successfully',
    }
  }


  private generateSlug(title: string): string {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }
}

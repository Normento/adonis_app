import { BaseMail } from '@adonisjs/mail'


export default class PostCreatedMail extends BaseMail {
  constructor(
    private user: any,
    private post: any
  ) {
    super()
  }

  /**
   * The "prepare" method is called automatically when
   * the email is sent or queued.
   */
  prepare() {
    this.message
      .to(this.user.email)
      .subject('Post Created Successfully')
      .htmlView('emails/post_created', { user: this.user, post: this.post })
  }
}

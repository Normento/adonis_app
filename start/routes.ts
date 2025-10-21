/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import AuthController from '#controllers/auth_controller'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import PostsController from '#controllers/posts_controller'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

// Auth routes
router.group(() => {
  router.post('/register', [AuthController, 'register'])
  router.post('/login', [AuthController, 'login'])
  router.post('/logout', [AuthController, 'logout']).use(middleware.auth({
    guards: ['api']
  }))

}).prefix('/api/auth')

// Protected route example
router.group(() => {
  router.post('/', [PostsController, 'store']).use(middleware.auth({
    guards: ['api']
  }))
  router.get('/:slug', [PostsController, 'show'])
  router.get('/', [PostsController, 'index'])
  router.put('/:id', [PostsController, 'update']).use(middleware.auth({
    guards: ['api']
  }))
  router.delete('/:id', [PostsController, 'destroy']).use(middleware.auth({
    guards: ['api']
  }))

}).prefix('/api/posts')


router.get('dashboard', ({ auth }) => {
    return auth.user})
    .use(middleware.auth({guards: ['api']}))



import { MyContext } from './../types';
import { Post } from './../entities/Post';
import {Resolver , Query, Ctx, Arg, Mutation, Int} from "type-graphql"


@Resolver()

export class PostResolver {

  @Query(()=> [Post])
  posts(
    @Ctx() { em }: MyContext ): Promise<Post[]> {
    return em.find(Post,{})
  }

  @Query(()=> Post, {nullable: true})
  post(
    @Arg('id') id: number, // infering the graphql type
    @Ctx() { em }: MyContext
    ): Promise<Post | null> {
    return em.findOne(Post,{ id })
  }

  @Mutation(()=> Post)
  async createPost(
    @Arg('title', ()=> String) title: string, // describing graphql type, smt redundant
    @Ctx() { em }: MyContext
    ): Promise<Post> {
    const post = em.create(Post, {title})
    await em.persistAndFlush(post)
    return post
  }

  @Mutation(()=> Post)
  async updatePost(
    @Arg('id', ()=> Int ) id: number, // describing graphql type, smt redundant
    @Arg('title', ()=> String, {nullable: true}) title: string, // every time you want to make possible nullable must explicitly set the type
    @Ctx() { em }: MyContext
  ): Promise<Post | null> {
    const post = await em.findOne(Post, {id})
    if(!post) {
      return null
    }
    if( typeof title !== 'undefined' ){
      post.title = title;
      await em.persistAndFlush(post);
    }
    return post
  }

  @Mutation(()=> Boolean)
  async deletePost(
    @Arg('id') id: number, // describing graphql type, smt redundant
    @Ctx() { em }: MyContext
  ): Promise<boolean> {
    try {
      await em.nativeDelete(Post, {id})
    } catch (error) {
      return false
    }
    return true;
  }
}

<template>
  <div id="blog-home">
      <h1>{{ page_title }}</h1>
      <!-- Create v-for and apply a key for Vue. Example is using a combination of the slug and index -->
      <div v-for="(post,index) in posts" :key="post.slug + '_' + index">
        <router-link :to="'/blog/' + post.slug">
          <article class="media">
            <figure>
              <!-- Bind results using a ':' -->
              <!-- Use a v-if/else if their is a featured_image -->
              <img v-if="post.featured_image" :src="post.featured_image" alt="">
              <img v-else src="http://via.placeholder.com/250x250" alt="">
            </figure>
            <h2>{{ post.title }}</h2>
            <p>{{ post.summary }}</p>
          </article>
        </router-link>
      </div>
  </div>
</template>

<script>
  import { butter } from '~/plugins/buttercms'
  export default {
    name: 'blog-home',
    data() {
      return {
        page_title: 'Blog',
        posts: []
      }
    },
    methods: {
      getPosts() {
        butter.post.list({
          page: 1,
          page_size: 10
        }).then((res) => {
          // console.log(res.data)
          this.posts = res.data.data
        })
      }
    },
    created() {
      this.getPosts()
    }
  }
</script>
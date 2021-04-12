# buttercms-nuxt

Nuxt starter project integrated with ButterCMS

## Install

Add [ButterCMS NPM module](https://www.npmjs.com/package/buttercms) as a dependency to your existing Nuxt project.

If you plan to use this project directly, simply execute below commands to get going:

```bash
npm i
npm run dev
```

These commands will install the required dependencies for the project and start the project on your browser.

## Quickstart

To integrate ButterCMS in your ongoing project, create a service file.
`plugins/buttercms.js`

```javascript
const Butter = require('buttercms')
export const butter = Butter('your-api-token')
```

Import ButterCMS client in your Vue file:

```javascript
import { butter } from '~/plugins/buttercms'
```

You can then test ButterCMS client by, for example, fetching all of your posts:

```javascript
butter.post
  .list({
    page: 1,
    page_size: 10
  })
  .then((res) => {
    console.log('Content from ButterCMS')
    console.log(res)
    this.posts = res.data.data
  })
```

This will fetch you upto 10 blog posts that you would have stored in your ButterCMS account

## Pages

### Get single page

With your homepage defined, the ButterCMS Pages API will return it in JSON format like this:

```json
{
  "data": {
    "slug": "home",
    "page_type": null,
    "fields": {
      "seo_title": "Marvellous Vue page powered by ButterCMS",
      "headline": "Marvellous Vue page powered by ButterCMS",
      "hero_image": "https://cdn.buttercms.com/WjJXN3B6ThWJpucfZM9P",
      "call_to_action": "Know more",
      "customer_logo": "https://cdn.buttercms.com/PTEqdDBReOq0X08W43sA"
    }
  }
}
```

To integrate this into your app, simply make a call to ButterCMS APIs using the ButterCMS service. Place this call in the `created` lifecycle method:
`pages/index.vue`

```javascript
import { butter } from '~/plugins/buttercms'
export default {
  name: 'customer-page',
  data() {
    return {
      page: {
        fields: {}
      }
    }
  },
  methods: {
    getPage() {
      butter.page
        .retrieve('*', 'homepage')
        .then((res) => {
          console.log(res.data)
          console.log(res.data.data)
          this.page = res.data.data
        })
        .catch((res) => {
          console.log(res)
        })
    }
  },
  created() {
    this.getPage()
  }
}
```

Display the result

```html
<template>
  <div id="customer-page">
    <figure>
      <img :src="page.fields.hero_image" />
    </figure>
    <h1>{{ page.fields.headline }}</h1>
    <button>{{ page.fields.call_to_action }}</button>

    <h3>Customers Love Us!</h3>
    <!-- Loop over customer logos -->
    <img
      v-for="logo in page.fields.customer_logos"
      :key="logo.index"
      :src="logo.logo_image"
    />
  </div>
</template>
```

##Get all page content of specific type. For instance, customers for the case study
`pages/customers/index.vue`

```javascript
import { butter } from '~/plugins/buttercms'
export default {
  name: 'customers-home',
  data() {
    return {
      page_title: 'Customers',
      // Create array to hold the pages from ButterCMS API
      pages: []
    }
  },
  methods: {
    // Get List of Customer Pages
    getPages() {
      butter.page.list('case_study').then((res) => {
        // console.log(res.data.data) // Check the results in the console
        this.pages = res.data.data
      })
    }
  },
  created() {
    // Fire on page creation
    this.getPages()
  }
}
```

Display the result

```html
<template>
  <div id="customers-home">
    <h1>{{ page_title }}</h1>
    <div v-for="(page, index) in pages" :key="index">
      <router-link :to="'/customers/' + page.slug">
        <div>
          <img class="customer-image" :src="page.fields.customer_logo" alt="" />
          <h2>{{ page.fields.headline }}</h2>
        </div>
      </router-link>
    </div>
  </div>
</template>
```

##Viewing specific page of a specific type
Below code create a customer component that displays the details of the customer.

`pages/customers/_slug.vue`

```javascript
import { butter } from '~/plugins/buttercms'
export default {
  name: 'customer-page',
  data() {
    return {
      slug: this.$route.params.slug,
      page: {
        slug: '',
        fields: {}
      }
    }
  },
  methods: {
    getPage() {
      butter.page
        .retrieve('case_study', this.slug)
        .then((res) => {
          // console.log(res.data.data)
          this.page = res.data.data
        })
        .catch((res) => {
          console.log(res)
        })
    }
  },
  created() {
    this.getPage()
  }
}
```

Display the result

```html
<template>
  <div id="customer-page">
    <figure>
      <img class="customer-image" :src="page.fields.customer_logo" />
    </figure>
    <h1>{{ page.fields.headline }}</h1>
    <h3>Testimonials</h3>
    <div v-html="page.fields.testimonial"></div>
    <div v-html="page.fields.body"></div>
  </div>
</template>
```

## Blog Engine

### Display posts

To display posts we create a simple /blog route in our app and fetch blog posts from the Butter API. See our [API reference](https://buttercms.com/docs/api/) for additional options such as filtering by category or author. The response also includes some metadata we'll use for pagination.

To retrieve the blog posts using ButterCMS client, you can use the function `butter.post.list({})`

`pages/blog/index.vue`

```javascript
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
      butter.post
        .list({
          page: 1,
          page_size: 10
        })
        .then((res) => {
          // console.log(res.data)
          this.posts = res.data.data
        })
    }
  },
  created() {
    this.getPosts()
  }
}
```

Display the result

```html
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
            <img v-if="post.featured_image" :src="post.featured_image" alt="" />
            <img v-else src="http://via.placeholder.com/250x250" alt="" />
          </figure>
          <h2>{{ post.title }}</h2>
          <p>{{ post.summary }}</p>
        </article>
      </router-link>
    </div>
  </div>
</template>
```

To display a complete post, you can use the `butter.post.retrieve(<url>)` method. See a full list of available post properties in our [API reference](https://buttercms.com/docs/api/).

`pages/blog/_slug.vue`

```javascript
import { butter } from '~/plugins/buttercms'
export default {
  name: 'blog-post',
  data() {
    return {
      post: {
        data: {
          author: {}
        },
        meta: {}
      }
    }
  },
  methods: {
    getPost() {
      butter.post
        .retrieve(this.$route.params.slug)
        .then((res) => {
          console.log(res.data)
          this.post = res.data
        })
        .catch((res) => {
          console.log(res)
        })
    }
  },
  watch: {
    $route(to, from) {
      this.getPost()
    }
  },
  created() {
    this.getPost()
  }
}
```

Display the result

```html
<template>
  <div id="blog-post">
    <h1>{{ post.data.title }}</h1>
    <h4>{{ post.data.author.first_name }} {{ post.data.author.last_name }}</h4>
    <div v-html="post.data.body"></div>

    <router-link
      v-if="post.meta.previous_post"
      :to="/blog/ + post.meta.previous_post.slug"
      class="button"
    >
      {{ post.meta.previous_post.title }}
    </router-link>
    <router-link
      v-if="post.meta.next_post"
      :to="/blog/ + post.meta.next_post.slug"
      class="button"
    >
      {{ post.meta.next_post.title }}
    </router-link>
  </div>
</template>
```

## Categories, Tags, and Authors

Use Butter's APIs for categories, tags, and authors to feature and filter content on your blog:

### List all categories and get posts by category

Call these methods on the `created()` lifecycle hook

```javascript
methods: {
  ...
  getCategories() {
    butter.category.list()
      .then((res) => {
        console.log('List of Categories:')
        console.log(res.data.data)
      })
  },
  getPostsByCategory() {
    butter.category.retrieve('example-category', {
        include: 'recent_posts'
      })
      .then((res) => {
        console.log('Posts with specific category:')
        console.log(res)
      })
  }
},
created() {
  ...
  this.getCategories()
  this.getPostsByCategory()
}
```

## RSS, Atom, and Sitemap

Butter generates RSS, Atom, and sitemap XML markup. To use these on your blog, return the generated XML from the Butter API with the proper content type headers.

We can fetch the RSS, Atom, and Sitemap feeds using the ButterCMS API, and pipe the response to routes on our server. Create the `/sitemap`, `/rss`, and `/atom` routes inside `server.js`

```javascript
server.get('/sitemap', (req, res) => {
  butter.feed.retrieve('sitemap').then((s) => {
    res.send(s.data.data)
  })
})

server.get('/atom', (req, res) => {
  butter.feed.retrieve('atom').then((s) => {
    res.send(s.data.data)
  })
})

server.get('/rss', (req, res) => {
  butter.feed.retrieve('rss').then((s) => {
    res.send(s.data.data)
  })
})
```

These routes will also update dynamically, everytime new content is added, or updated.

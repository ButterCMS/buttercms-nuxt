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

<script>
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
</script>

<style scoped>
.customer-image {
  max-width: 50vw;
}
</style>


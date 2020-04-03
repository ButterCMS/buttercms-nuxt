<template>
  <div id="customer-page">
    <figure>
      <img :src="page.fields.hero_image" />
    </figure>
    <h1>{{ page.fields.headline }}</h1>
    <button>{{ page.fields.call_to_action }}</button>

    <h3>Customers Love Us!</h3>
    <!-- Loop over customer logos -->
    <img v-for="logo in page.fields.customer_logos" :key="logo.index" :src="logo.logo_image" />
  </div>
</template>

<script>
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
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>

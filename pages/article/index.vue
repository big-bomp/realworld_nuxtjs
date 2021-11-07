<template>
  <div class="article-page">

  <div class="banner">
    <div class="container">

      <h1>{{article.title}}</h1>

      <article-meta :article="article"></article-meta>

    </div>
  </div>

  <div class="container page">

    <div class="row article-content">
      <div class="col-md-12" v-html= "article.body">
      </div>
    </div>

    <hr />

    <div class="article-actions">
      <article-meta :article="article"></article-meta>
    </div>

    <div class="row">

      <div class="col-xs-12 col-md-8 offset-md-2">

        <article-comments :article="article"></article-comments>

      </div>

    </div>

  </div>

</div>
</template>

<script>
import { getArticle } from '@/api/article';
import MarkdownIt from 'markdown-it'; //解析 md文档
import ArticleMeta from './components/article-meta.vue';
import ArticleComments from './components/article-comments.vue';

export default {
  components: { ArticleMeta, ArticleComments },
  name: 'ArticleIndex',
  async asyncData({ params }) {
    const { data } = await getArticle(params.slug)
    const { article } = data
    const md = new MarkdownIt()

    article.body = md.render(article.body)

    return {
      article
    }
  },
  head() {
    return {
      title: `${this.article.title} - RealWorld`,
      meta: [
        {
          hid: 'description', //唯一标识 
          name: 'description',
          content:
            this.article.description
        }
      ]
    }
  }
  
}
</script>

<style>

</style>
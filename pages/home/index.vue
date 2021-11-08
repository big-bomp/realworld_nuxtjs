<template>
  <div class="home-page">
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li v-if="user" class="nav-item">
                <nuxt-link
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'your_feed',
                    },
                  }"
                  exact
                  class="nav-link"
                  :class="{
                    active: tab === 'your_feed',
                  }"
                  >Your Feed</nuxt-link
                >
              </li>
              <li class="nav-item">
                <nuxt-link
                  exact
                  class="nav-link"
                  :class="{
                    active: tab === 'golbal_feed',
                  }"
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'global_feed',
                    },
                  }"
                  >Global Feed</nuxt-link
                >
              </li>
              <li v-if="tag" class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{
                    active: tab === 'tag',
                  }"
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'tag',
                      tag: tag,
                    },
                  }"
                  >#{{ tag }}</nuxt-link
                >
              </li>
            </ul>
          </div>

          <div
            class="article-preview"
            v-for="article in articles"
            :key="article.slug"
          >
            <div class="article-meta">
              <nuxt-link
                :to="{
                  name: 'profile',
                  params: {
                    username: article.author.username,
                  },
                }"
              >
                <img :src="article.author.image" alt="" />
              </nuxt-link>
              <div class="info">
                <nuxt-link
                  class="autor"
                  :to="{
                    name: 'profile',
                    params: {
                      username: article.author.username,
                    },
                  }"
                >
                  {{ article.author.username }}
                </nuxt-link>
                <span class="date">{{ article.createdAt | date }}</span>
              </div>

              <button
                class="btn btn-outline-primary btn-sm pull-xs-right"
                :class="{
                  active: article.favorited,
                }"
                @click="onFavorite(article)"
                :disabled= "article.favorateDisabled"
              >
                <i class="ion-heart"></i> {{ article.favoritesCount }}
              </button>
            </div>
            <nuxt-link
              class="preview-link"
              :to="{
                name: 'article',
                params: {
                  slug: article.slug,
                },
              }"
            >
              <h1>{{ article.title }}</h1>
              <p>{{ article.description }}</p>
              <span>Read more...</span>
            </nuxt-link>
          </div>
        </div>

        <!-- 分页列表 -->
        <nav>
          <ul class="pagination">
            <li
              class="page-item"
              :class="{
                active: item === page,
              }"
              v-for="item in totalPage"
              :key="item"
            >
              <nuxt-link
                class="page-link"
                :to="{
                  name: 'home',
                  query: {
                    page: item,
                    tag: $route.query.tag,
                    tab: tab,
                  },
                }"
                >{{ item }}</nuxt-link
              >
            </li>
          </ul>
        </nav>
        <!-- /分页列表 -->

        <!-- 标签列表 start -->
        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>

            <div class="tag-list">
              <nuxt-link
                :to="{
                  name: 'home',
                  query: {
                    tag: item,
                  },
                }"
                class="tag-pill tag-default"
                v-for="item in tags"
                :key="item"
              >
                {{ item }}
              </nuxt-link>
            </div>
          </div>
        </div>
        <!-- 标签列表 end -->
      </div>
    </div>
  </div>
</template>

<script>
import { 
  getArticles,
  getYourFeedArticles,
  addFavorite,
  deleteFavorite,
  } from "@/api/article";
import { getTags } from "@/api/tag";
import { mapState } from "vuex";

export default {
  name: "HomeIndex",
  async asyncData({ query }) {
    const page = Number.parseInt(query.page || 1);
    const limit = 20;
    const tab = query.tab || "global_feed";
    const tag = query.tag;
    // const { data } = await getArticles({
    //   limit,
    //   offset: (page - 1) * limit
    // })
    // const { data: tagData } = await getTags()

    const loadArticles =
      tab === "global_feed" ? getArticles : getYourFeedArticles;
    const [articleRes, tagRes] = await Promise.all([
      loadArticles({
        limit,
        offset: (page - 1) * limit,
        tag,
      }),
      getTags(),
    ]);
    // console.log(articleRes);
    const { articles, articlesCount } = articleRes.data;
    const { tags } = tagRes.data;

    articles.forEach(article => {
      // 遍历让所有的点赞按钮  处于可以点击的状态
      article.favoriteDisabled = false
    });
    return {
      articles, //文章列表
      articlesCount, // 文章总数
      tags, // 标签列表
      limit, //每页大小
      page, //页码
      tag, // 选项卡
      tab, // 数据标签
    };
  },
  watchQuery: ["page", "tag", "tab"], //监听参数的改变 会触发 asyncData  等方法
  computed: {
    ...mapState(["user"]),
    totalPage() {
      return Math.ceil(this.articlesCount / this.limit);
    },
  },
  methods: {
    async onFavorite(article){
      // 将按钮设置为不允许点击  防止网速慢 多次点击
      article.favoriteDisabled = true
      if(article.favorited) {
        // 取消点赞
        await deleteFavorite(article.slug)
        article.favorited = false
        article.favoritesCount -= 1 
      }else{
        // 添加点赞
        await addFavorite(article.slug)
        article.favorited = true
        article.favoritesCount += 1
      }
      //点赞成功之后 将按钮设置为允许点击  
      article.favoriteDisabled = false  

    }
  }
};
</script>

<style></style>

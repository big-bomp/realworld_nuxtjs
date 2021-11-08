<template>
  <div class="editor-page">
  <div class="container page">
    <div class="row">

      <div class="col-md-10 offset-md-1 col-xs-12">
        <form 
        :model="article"  
        :rules="rules" >
          <fieldset>
            <fieldset class="form-group">
                <input required type="text" v-model="article.title" class="form-control form-control-lg" placeholder="Article Title">
            </fieldset>
            <fieldset class="form-group">
                <input required type="text" v-model="article.description" class="form-control" placeholder="What's this article about?">
            </fieldset>
            <fieldset class="form-group">
                <textarea v-model="article.body" class="form-control" rows="8" placeholder="Write your article (in markdown)"></textarea>
            </fieldset>
            <fieldset class="form-group">
                <input @keypress.enter="handlerEnter" v-model="article.tagList" type="text" class="form-control" placeholder="Enter tags"><div class="tag-list"></div>
            </fieldset>
             <!-- 标签 start -->
        <div class="col-md-3">
          <div class="sidebar">
            <!-- <p>Popular Tags</p> -->

            <div class="tag-list">
              <nuxt-link
                :to="{
                  name: 'home',
                  query: {
                    tag: item,
                  },
                }"
                class="tag-pill tag-default"
                v-for="item in tagListArr"
                :key="item"
              >
                {{ item }}
              </nuxt-link>
            </div>
          </div>
        </div>
        <!-- 标签 end -->
            <button class="btn btn-lg pull-xs-right btn-primary" type="button"
            @click="handlerPublish">
                Publish Article
            </button>
          </fieldset>
        </form>
        
      </div>

     
    </div>
  </div>
</div>
</template>

<script>
import { createArticles } from '@/api/article.js';
export default {
  // 在路由匹配组件渲染之前会执行中间件处理
  middleware: 'authenticated',
  name: 'EditorIndex',
  data() {
    return {
      tagListArr:[],  //这是个数组 用来撞标签的
      article: {
        title: "",
        description: "",
        body: "",
        tagList: []
      },
      rules:{
        title:[
          {
            required: true,
            trigger: "blur",
            message: "请输入标题"
          }
        ],
        description:[
          {
            required: true,
            trigger: "blur",
            message: "请输入描述信息"
          }
        ],
        body: [
          {
            required: true,
            trigger: "blur",
            message: "请输入正文内容"
          }
        ]
      }
    }
  },
  methods: {
    // 文章发布
    async handlerPublish(){
      const {title, description, body, tagList}= this.article
      if ([title, description, body].includes("")) {
        window.alert("请将必填项 title，about， article填写后再提交")
        return false
      }
      console.log(tagList);
      
      await createArticles(JSON.stringify({article:{title, description, body, tagList}}))
    },
    async handlerEnter(){
      const { tagList } = this.article
      if (tagList === "") return false;

        
      await this.tagListArr.push(tagList)
      this.article.tagList = []
    }
  }
}
</script>

<style>

</style>
/*
 * @Author: yuht 
 * @Date: 2018-11-22 17:37:23 
 * @Last Modified by: yuht
 * @Last Modified time: 2018-11-29 15:15:09
 * @desc 带有 下拉页面的查询页面 支持返回按钮 查询按钮   
 */

<template>
  <!-- 根元素 -->
  <div class="hf-search"> 
    <!-- 绑定样式 使用:style="{key:value,key:value}" -->
     
    <mu-paper v-bind:style="{ width: maxWidth }" :z-depth="1" >
      <!-- 布局 非必须 -->
      <mu-row>
        <!-- <mu-col span="1" align-self="center" v-if="hasBack"> -->
          <!-- 需要渲染的组件 @click=''绑定原生事件   
          $emit('callname',value)发射一个信号到外面去,使用callname监听,不要使用驼峰全部使用小写,value是需要传进去的参数 非必填   -->
          <!-- <mu-icon style="width:100%" :value="backIcon" @click="$emit('back')"></mu-icon>
        </mu-col> -->
        <mu-col style="text-align:center">
          <!-- v-bind:value可以简写成 :value是绑定一个值到value上,也可以绑定其他值 外面用:value.sync="需要绑定的字段" 可以实现props值的双向绑定 -->
          <!-- v-model 双向绑定 组件上的值和data中的值可以实时的绑定更改 -->
          <mu-text-field @blur="outside" @input="input" v-bind:value="s_value" v-model="s_value" :action-icon="s_cleanIcon" :action-click="() => {s_value =''}" style="width:100%;background-color:#fff;padding: 5px 10px" :placeholder="placeholder" @click="openpop" @change="updateValue" >
            <div slot="prepend">
              <slot name="left-content"></slot>
            </div>
            <div slot="append">
              <slot name="right-content"></slot>
            </div>
          </mu-text-field>
        </mu-col>
        <!-- <mu-col span="1" align-self="center" v-if="hasSearchIcon">
          <mu-icon style="width:100%" :value="searchIcon" @click="$emit('search')"></mu-icon>
        </mu-col> -->
      </mu-row>
     
      <mu-popover :placement="position" :open="show" v-bind:style="{ maxWidth: maxWidth, width: width }">
        <slot name="content1"></slot>
        <slot name="content"></slot>
      </mu-popover>
      
    </mu-paper>
    
    
  </div>
</template>
<script>
export default {
  props: {//props 外面的组件向里面传值 的定义 还有一种写法是props:['key','key1']这种不能选择类型
    value: {//key 
      type: String,//类型
      default() {// 默认值 可选
        return "";
      },
      required: true //是否必填
    },
    position: {
      type: String,
      default() {
        return "bottom-start";
      }
    },
    show:{
      type:Boolean,
      required: true
    },
    placeholder: {
      type: String,
      default() {
        return "在此输入搜索内容";
      }
    },
    // hasBack: {
    //   type: Boolean,
    //   default() {
    //     return true;
    //   }
    // },
    // hasSearchIcon: {
    //   type: Boolean,
    //   default() {
    //     return true;
    //   }
    // },
    maxWidth: {
      type: String,
      default() {
        return "90%";
      }
    },
    searchIcon: {
      type: String,
      default() {
        return "search";
      }
    },
    backIcon: {
      type: String,
      default() {
        return "navigate_before";
      }
    },
    cleanIcon: {
      type: String,
      default() {
        return "";
      }
    }
  },
  data() {
    return {
      s_value:this.value,//使用this.xxx可以直接获取props的值 这里是做了个缓存 到本地的操作
      width:'100vw',
      s_cleanIcon:this.cleanIcon
    };
  },
  methods: {
    updateValue() {
      this.$emit("update:value", this.s_value);
    },
    openpop() {
      this.cleanIconShow();
      this.$emit("tap",this.show);//向组件外发射一个事件 tap 并传出 show这个参数， tap事件在外面使用@tap监听
    },
    outside(){
      this.s_cleanIcon = ""
      this.$emit("missfocus",this.show);
    },
    input(){
      this.cleanIconShow();
      this.$emit("update:value",this.s_value);
    },
    cleanIconShow(){
      if(this.s_value.length > 0){
        this.s_cleanIcon = "highlight_off"
      } else {
        this.s_cleanIcon = ""
      }
    }
  },
  watch:{
    value:{
      handler(newVal,old){
        this.s_value = newVal
      }
    }
  },
  mounted() {
  },
};
</script>
<style scoped>
.flex-wrapper {
  height: 30px;
}
.mu-input {
  margin: 0;
}
.hf-search {
  background-color: #fff;
}
</style>

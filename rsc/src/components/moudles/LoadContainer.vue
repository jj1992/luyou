<template>
  <mu-load-more
    @refresh="refresh"
    :refreshing="v_refreshing"
    :loading="v_loading"
    @load="load"
    :loading-text="v_config.loadingText"
    :loaded-all="loadAll"
  >
    <!-- <slot :item="item" :index="index" v-for="(item,index) in  v_data" :total="total" :curr-length="v_data.length"></slot> -->
    
    <div v-if="noData" style="width:100%;text-align:center;height:50px;line-height:50px;">
        <span >暂无数据</span>
    </div>
    <slot
      :item="v_data"
      :total="total"
      :curr-length="v_data.length"
      v-else
    ></slot>
  </mu-load-more>
</template>

<script>
const E_LOAD = 0
const E_REFRESH = 1
export default {
  name: "",
  props: {
    config: {
      type: Object
    },
    data: {
      type: Array,
      default() {
        return []
      }
    },
    needLoop: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      v_data: this.data,
      v_defaultConfig: {
        url: "",
        header: {},
        pageSize: 20,
        pageNo: 0,
        params: {},
        dataKey: "data",
        onResponseError() {},
        loadingText: "正在加载..."
      },
      v_config: {},
      v_refreshing: false,
      v_loading: false,
      total: 0,
      pageCount:1,
      noData:false,
      loadAll:true
    };
  },
  methods: {
    //刷新步骤
    refresh() {
      this.refreshStart() //刷新流程启动
    },
    refreshStart() {
      //刷新时 重置分页属性
      const config = this.v_config

      config.pageNo = 0
      this.total = 0
      this.v_loading = false

      //设置参数
      const params = new URLSearchParams();

      for (let key of Object.keys(config.params)) {
        params.append(key, config.params[key])
      }
      params.append("page", config.pageNo)

      if (config.url) {
        this.refreshing(config.url, params, config.dataKey) //发送请求函数
      }
    },
    refreshing(url, params, dataKey) {
      //开启刷新图标
      this.v_refreshing = true

      //发送请求
      this.$axios
        .post(url, params)
        .then(resp => {
          this.refreshEnd()
          this.setData(E_REFRESH, resp.data, dataKey) //设置数据
        })
        .catch(e => {
          this.onResponseError(e)
        });
    },
    refreshEnd(res) {
      //去掉加载图标
      this.v_refreshing = false
    },

    //加载步骤
    load() {
      this.loadStart()
    },
    loadStart() {
      if (this.v_refreshing) return
      const config = this.v_config

      const params = new URLSearchParams()

      for (let key of Object.keys(config.params)) {
        params.append(key, config.params[key])
      }

      params.append("page", this.v_data.length == this.total ?  config.pageNo :  ++config.pageNo)
      if (config.url) {
        this.loading(config.url, params, config.dataKey)
      }
    },
    loading(url, params, dataKey) {
      this.v_loading = true

      this.$axios
        .post(url, params)
        .then(resp => {
          this.loadEnd();
          this.setData(E_LOAD, resp.data, dataKey)
        })
        .catch(e => {
          this.onResponseError(e)
        });
    },
    loadEnd() {
      this.v_loading = false;
    },

    setData(type, res, dataKey) {
      const data = res[dataKey]
      switch (type) {
        case E_REFRESH:
          this.v_data = data
          break
        case E_LOAD:
          this.v_data = this.v_data.concat(data)
          break
      }
      this.total = res.total
      if(this.total > 20 && this.v_data.length != this.total) this.loadAll = false; else  this.loadAll = true
      if(this.v_data.length == 0 ){
        this.noData = true
        return;
      }else{ 
        this.noData = false
      }
    },

    extend() {
      this.v_config = Object.assign(this.v_defaultConfig, this.config)
    },

    onResponseError(e) {
      const config = this.v_config
      config.onResponseError(e)
    },
  
  },
  mounted() {
    this.extend();
    this.refresh();
  },
  watch: {
    'config.params':{
        handler(){
            this.extend()
            this.refreshStart()
        },
        deep:true
    }
  }
};
</script>

<style scoped>
</style>

<template>
    <mu-container class="CircuitUse" style="width: 100%;padding:0px;height:100vh;display:flex;flex-direction:column" ref="container">
        <mu-appbar style="width: 100%;" color="primary">
            <mu-button icon slot="left" @click="navigate_back">
                <mu-icon value="navigate_before"></mu-icon>
            </mu-button>
            {{title.title}}标题
        </mu-appbar>
        <mu-tabs :value.sync="currentIndex" color="#2196f3" text-color="#2196f3" indicator-color="#2196f3" inverse full-width style="width:100%">
            <mu-tab v-for="item in title.tabs" v-bind:key="item.tab" :to="item.link" style="text-align:center" :replace=true>{{item.tab}} ({{item.length}})</mu-tab>
        </mu-tabs>
        <div style="flex: 1 ;overflow: auto;">
            <router-view></router-view>
        </div>
    </mu-container>
</template>
<script>
export default {
  data() {
    return {
      currentIndex: 0,
      titleList: {
        gold: {
          title: "点对网-黄金",
          tabs: [
            {
              tab: "专线业务层",
              length: 2,
              link:{
                  path:'/circuitUseItemList',
                  query:{type:1}
              },
            },
            {
              tab: "空闲端口数",
              length: 33,
              link:{
                  path:'/circuitUseItemList',
                  query:{type:2}
              },
            }
          ],
        },
        violet: {
          title: "点对网-紫金",
           tabs: [
            {
              tab: "二层汇聚",
              length: 2,
              link:{
                  path:'/circuitUseItemList',
                  query:{type:3}
              },
            },
            {
              tab: "空闲端口数",
              length: 33,
              link:{
                  path:'/circuitUseItemList',
                  query:{type:4}
              },
            }
          ],
        },
        dedicated: {
          title: "点对网-光专/光快",
          tabs: [
            {
              tab: "POS设备",
              length: 2,
              link:{
                  path:'/circuitUseItemList',
                  query:{type:5}
              },
            },
            {
              tab: "空闲端口数",
              length: 33,
              link:{
                  path:'/circuitUseItemList',
                  query:{type:6}
              },
            }
          ],
        },
        point: {
          title: "点对点",
          tabs: [
            {
              tab: "PTN",
              length: 2,
              link:{
                  path:'/circuitUseItemList',
                  query:{type:7}
              },
            },
            {
              tab: "POTN",
              length: 33,
              link:{
                  path:'/circuitUseItemList',
                  query:{type:8}
              },
            },
            {
              tab: "空闲端口数",
              length: 33,
              link:{
                  path:'/circuitUseItemList',
                  query:{type:9}
              },
            }
          ],
        }
      },
      title: {},
      type: null
    };
  },
  methods: {
    navigate_back() {
      this.$router.back(-1);
    },
    init() {
      this.type = this.$route.query.titleType;
      this.title = this.titleList[this.type];
      this.$router.replace(this.title.tabs[0].link);
    }
  },
  mounted() {
    this.init();
  }
};
</script>
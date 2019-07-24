/*
 * @Author: yuht 
 * @Date: 2018-11-23 13:37:16 
 * @Last Modified by: yuht
 * @Last Modified time: 2018-12-21 07:20:23
 * @desc 楼宇详情 跳转到 楼内机房 业务支撑 楼内业务  本页面需要传入楼宇id
 */

<template>
  <div style="" class="buildingDetail">

    <!-- 标题 -->
    <div>
      <mu-appbar style="width: 100vw;" color="primary">
        <mu-button icon slot="left" @click="navigate_back">
          <mu-icon value="navigate_before"></mu-icon>
        </mu-button>
        详情信息
      </mu-appbar>
      <!-- <mu-alert color="error" delete v-if="alert === true" @delete="closeAlert()" style="position:fixed;bottom:0;z-index:999;" transition="mu-scale-transition">
        <mu-icon left value="warning"></mu-icon> 请求异常
      </mu-alert> -->
    </div>

    <!-- 循环渲染表单 -->
    <div style="overflow:auto;padding-top:10px; margin-bottom:60px;">
      <mu-load-more @refresh="refresh" :refreshing="refreshing">
        <mu-row v-for="(item,index) in models" :key="index" class="line">
          <mu-col span="6" class="title">
            <span>{{item.title}}</span>
          </mu-col>
          <mu-col class="info">
            {{
            content[item.key]
            }}
          </mu-col>
          <mu-divider v-if="index < models.length-1"></mu-divider>
        </mu-row>
      </mu-load-more>
    </div>

    <!-- 底部按钮 -->

    <mu-flex class="btnUni" align-items="center">
      <mu-flex justify-content="center" fill>
        <mu-button color="primary" @click="toComputerRoom">楼内机房</mu-button>
      </mu-flex>
      <mu-flex v-if="$util.hasRight('resourcePrediction')" justify-content="center" fill>
        <mu-button color="primary" @click="toServiceBrace">业务资源预判</mu-button>
      </mu-flex>
      <mu-flex justify-content="center" fill>
        <mu-button color="primary" @click="toBuildService">楼内业务</mu-button>
      </mu-flex>
    </mu-flex>    

  </div>

</template>

<script>
export default {
  props: ["id","type",'buildingType'],
  data() {
    return {
      content: {
        reseau: "",
        physicsReseau: "",
        broadBand: "",
        support: "",
        scene: "",
        street: "",
        buildingCategory: "",
        constructionNo: "",
        district: "",
        ridgepoleNo: "",
        status: "",
        name: "",
        area: "",
        bureau: "",
        address: "",
        id: null
      },
      models: [
        {
          title: "楼宇名称",
          key: "name"
        },
        {
          title: "所属分公司",
          key: "area"
        },
        {
          title: "所属分局",
          key: "bureau"
        },
        {
          title: "所属网格",
          key: "reseau"
        },
        {
          title: "详细地址",
          key: "address"
        },
        {
          title: "物理网格",
          key: "physicsReseau"
        },
        {
          title: "有线宽带覆盖方式",
          key: "broadBand"
        },
        {
          title: "是否交维",
          key: "support"
        },
        {
          title: "光纤覆盖场景",
          key: "scene"
        },
        {
          title: "街道_地区_镇",
          key: "street"
        },
        {
          title: "楼宇类别",
          key: "buildingCategory"
        },
        {
          title: "楼栋号",
          key: "ridgepoleNo"
        },
        {
          title: "行政区划",
          key: "district"
        },
        {
          title: "楼宇序号",
          key: "constructionNo"
        },
        {
          title: "楼宇状态",
          key: "status"
        }
      ],
      // alert: false,
      refreshing: false
    };
  },
  methods: {
    navigate_back() {
      this.$router.back(-1);
    },
    // closeAlert() {
    //   this.alert = false;
    // },
    initData() {
      this.requestData();
    },
    requestData() {
      let params=new URLSearchParams();
      params.append("id",this.id);
      params.append("buildingType",this.buildingType);
      this.$axios
        .post("/building/details", params)
        .then(res => {
          if(res.data.code === 200 && res.data.data){
            this.content = res.data.data;
            this.refreshing = false;
          } 
        })
        .catch(() => {
          // this.alert = true;
          // this.$toast.error('请求异常');
        });
    },
    refresh() {
      this.refreshing = true;
      this.requestData();
    },
    toServiceBrace() {
      //打開下面的頁面
      this.$router.push({ path:"/serviceBrace",query:{buildId:this.content.constructionNo,buildName:this.content.name,type:this.content.buildingType}});
    },
    toComputerRoom() {

      this.$store.state.BuildingDevices.buildName = this.content.name;
      this.$store.state.BuildingDevices.area = this.content.area;
      this.$store.state.BuildingDevices.bureau = this.content.bureau;

      this.$router.push({ path: "/buildingDeviceListIndex",query:{buildId:this.content.constructionNo}});
    },
    toBuildService() {
      this.$router.push({ path: "/buildService" ,query:{buildId:this.content.constructionNo}});
    }
  },
  mounted() {
    this.initData();
  }
};
</script>

<style scoped>
.buildingDetail {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.info {
  text-align: right;
  font-size: 12px;
  padding: 10px 0px;
  color:rgba(0,0,0,.54)
}
.title {
  font-weight: 800;
  font-size: 14px;
  padding: 10px 0px;
}
.line {
  line-height: 200%;
  padding: 0px 15px;
}
.warrning {
  position: fixed;
  bottom: 0;
  z-index: 999;
}
.btnUni{
    position: fixed;
    bottom: 0;
    background-color: #fff;
    height: 60px;
    width:100%;
    box-shadow: -1px 4px 2px 0px rgba(0,0,0,.2), 0 5px 4px 0 rgba(0,0,0,.14), 0 -4px 10px 0 rgba(0,0,0,.12);
}
</style>

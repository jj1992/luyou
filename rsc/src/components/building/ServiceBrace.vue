<template>
  <div style="width:100%;height:100%;">
    <mu-appbar class="" style="width: 100%;" color="primary">
      <mu-button icon slot="left" @click="navigate_back">
        <mu-icon value="navigate_before"></mu-icon>
      </mu-button>
      业务资源预判
    </mu-appbar>
    <div style="height:100%;width:100%;">
    <mu-container style="min-height:400px;height:430px;">
      <div v-if="loadMsg" class="loadStyle">
      <div style="position:absolute;width:100%;height:100%;z-index:-1">
          <img src="../../../public/images/loading.gif" style="z-index:1000; margin-top:270px;margin-left:45%;" />
      </div>
      </div>
      <mu-form :model="form" label-position="left" label-width="100" auto-validate class="serv-b-form">
        <div v-if="type === '0'">
          <mu-form-item label="楼宇" label-position="left" prop="building">
            <mu-text-field v-model="form.building"></mu-text-field>
          </mu-form-item>
          <mu-form-item label="机房" label-position="left">
            <mu-select no-data-text="请选择一项" filterable v-model="form.computerRoom">
              <div v-for="city in citys" :key="city.id" @click="motorRoomId(city.id)">
              <mu-option :label="city.name" :value="city.name"></mu-option>
              </div>
            </mu-select>
          </mu-form-item>
        </div>
        <!-- 暂时不用 -->
        <div v-if="type === '放置点'">
          <mu-form-item label="放置点" label-position="left" prop="building">
            <mu-text-field v-model="form.building"></mu-text-field>
          </mu-form-item>
        </div>
        
        <mu-form-item label="业务类型" label-position="left">
          <mu-select no-data-text="请选择一项" filterable v-model="form.workType" @change="test(form.workType)">
            <mu-option v-for="item in types" :key="item" :label="item" :value="item"></mu-option>
          </mu-select>
        </mu-form-item>
        <div v-if="form.workType != '光缆接入方案预判'">
        <mu-form-item label="带宽" label-position="left" prop="bandwidth" :rules="numRules">
          <mu-text-field v-model="form.bandwidth">Mbps</mu-text-field>
        </mu-form-item>
        </div>
        <div v-if="form.workType == '光缆接入方案预判'">
          <div style="width:252px;display:inline-block">
            <mu-form-item class="input" label="局端楼宇" label-position="left" prop="building_z">
              <mu-text-field v-model="form.building_z"></mu-text-field>
            </mu-form-item>
           </div> 
            <mu-button color="primary" @click="searchBuildings">查询</mu-button>
            <mu-form-item label="局端机房" label-position="left">
              <mu-select no-data-text="请选择一项" filterable v-model="form.computerRoom_z">
                <div v-for="city in citys_z" :key="city.id" @click="Zduanjfid(city.id)">
                <mu-option :label="city.name" :value="city.name"></mu-option>
                </div>
              </mu-select>
            </mu-form-item>
        </div>
        <div v-if="flag">
          <!-- <mu-form-item label="是否使用范围" label-position="left">
              <mu-radio :value="0" v-model="form.radio" label="否"></mu-radio>
              <mu-radio :value="1" v-model="form.radio" label="是"></mu-radio>
          </mu-form-item>
          <mu-form-item label="范围" label-position="left" prop="scope" :rules="numRules">
            <mu-text-field v-model="form.scope">米</mu-text-field>
          </mu-form-item> -->
          <mu-form-item label="POS类型" label-position="left">
          <mu-select no-data-text="请选择一项" filterable v-model="form.POSType">
            <mu-option v-for="posType in posTypes" :key="posType" :label="posType" :value="posType"></mu-option>
          </mu-select>
        </mu-form-item>
        </div>
      </mu-form>
      <!-- 查询结果弹框 -->
      <mu-dialog title="结果" width="600" max-width="80%" :esc-press-close="false" :overlay-close="false" :open.sync="openAlert">
            <div v-if="this.action === 1">{{pointToPointMsg}}</div>
            <div v-if="this.action === 2">{{pointToNetMsg}}</div>
            <div v-if="this.action === 3">{{yellowPlatinum}}</div>
            <div v-if="this.action === 4">{{opticalCableMsg}}</div>
        <mu-button slot="actions" flat color="primary" @click="closeDialog">关闭</mu-button>
      </mu-dialog>
      <!-- 楼宇查询弹框 -->
      <mu-dialog width="600" max-width="90%" :esc-press-close="false" :overlay-close="false" :open.sync="openBuildings">
      <div v-if="Buildingslist.length > 0" style="width:100%;height:400px;overflow-y:scroll;-webkit-overflow-scrolling: touch;">
      <mu-load-more  :loaded-all="loadOver" @refresh="refresh" :refreshing="refreshing" :loading="loading" @load="load" :loading-text=" loadOver === true ? '已经到底了' : '正在努力加载...'">        

        <table class="" style="width:100%; border-collapse: collapse; border:none; margin-top:10px; font-size:14px;min-height:100px;">
          <tr>
            <th style="width:40px;">选中</th>
            <th>楼宇</th>
            <!-- <th>建筑物</th> -->
          </tr> 
          <tr v-for="(item,index) in Buildingslist" :key="item.id"  style="text-align:center;">
            <td><mu-radio :value="index" v-model="radio"></mu-radio></td>
            <td>{{item.name}}</td>
            <!-- <td>{{item.jianzhuwuname}}</td> -->
          </tr>
        </table>
      </mu-load-more>
      </div>
      <mu-button slot="actions" flat color="primary" @click="confirmBuildingSelect">确认</mu-button>
      <mu-button slot="actions" flat color="primary" @click="closeBuildingsDialog">关闭</mu-button>
      </mu-dialog>
      <!-- 云快/云专数据列表 -->
      <mu-dialog title="可用POS资源" width="600" max-width="90%" :esc-press-close="false" :overlay-close="false" :open.sync="openPointToNet">
        <div style="width:100%;height:400px;overflow-y:scroll;-webkit-overflow-scrolling: touch;">
            <table class="" style="width:100%; border-collapse: collapse; border:none; margin-top:10px; font-size:14px;min-height:100px;">
          <tr style="font-size:16px;">
            <th>名称</th>
            <th>端口数</th>
            <th>空闲数</th>
          </tr> 
          <tr v-for="item in pointToNetList" :key="item.id"  style="text-align:center;">
            <td>{{item.shebei_bianhao}}</td>
            <td>{{item.zong_shu}}</td>
            <td>{{item.kongjian_shu}}</td>
          </tr>
        </table>
        </div>
        <mu-button slot="actions" flat color="primary" @click="closePointToNetDialog">关闭</mu-button>
      </mu-dialog>
    </mu-container> 
        <mu-flex class="btnUni" align-items="center">
          <mu-flex justify-content="center" fill>
            <mu-button full-width color="primary" @click="toService">查看资源</mu-button>
          </mu-flex> 
        </mu-flex> 
    </div>
    
  </div>
</template>
<script>
export default {
  props:['buildId','buildName','type','id',"bureauId"],
  data() {
    return {
      form: {
        computerRoom: "无",
        building:'',
        building_z:'',
        computerRoom_z:'无',
        bandwidth: 100,
        purpose: 1,
        serviceType: "gold",
        workType:'点对点业务',
        scope:'300',
        POSType:'公众',
        radio:0
      },
      citys: [],
      citys_z: [],
      types:['点对点业务','点对网黄白金','点对网紫金','点对网云快/云专资源预判','光缆接入方案预判'],
      posTypes:['公众','专线'],
      numRules: [{ validate: val => !isNaN(val), message: "请输入数字" }],
      flag:false,
      data:{},
      pointToPointMsg:'',
      openAlert:false,
      msgShow:'',
      pointToNetList:[],
      openPointToNet:false,
      action:'',
      pointToNetMsg:'',
      endOffice:{},
      ZbuildingObj:{},
      Buildingslist:[],
      radio:'',
      openBuildings:false,
      loading:false,
      currPage:0,
      loadOver:false,
      total:0,
      aDuanJiFangId:'',
      zDuanJiFangId:'',
      ywLeiXing:'',
      yellowPlatinum:'',
      PointToNetData:{},
      opticalCableData:{},
      opticalCableMsg:'',
      loadMsg:false,
      timer:null
    };
  },
  created(){
    this.form.building = this.buildName
    if(this.type === '放置点'){
      this.types = [' 点对网云快/云专资源预判','光缆接入方案预判']
      if(this.bureauId){
        this.Zbuilding(this.bureauId)
      }else{
         this.motorRoomId(this.id)
      }
    }else if(this.type === '0'){
      this.types = ['点对点业务','点对网黄白金','点对网紫金',' 点对网云快/云专资源预判','光缆接入方案预判']
    }
    this.form.workType = this.types[0]
  },
  methods: {
    navigate_back() {
      this.$router.back(-1);
    },
    test(val){
      if(this.form.workType.includes('点对网云快/云专资源预判')){
        this.flag = true
        this.form.radio = 0
      } else{
        this.flag = false
        this.form.radio = 0
      }
      // if(this.form.workType == '光缆接入方案预判'){
      //   this.postData()
      // }
    },
    //点对点业务查询数据接口
    pointToPoint(){
        this.action = 1
        let params=new URLSearchParams();
        params.append("diaoduLeiXing",'41');
        params.append("bzDiZhi",this.buildId + '_0_0');
        params.append("dkLeiXing",'3');
        params.append("whetherVlan",'0');
        params.append("sfZhaoJuDuan",'1');
        params.append("chanPinLeiBie",'800507');
        params.append("duanJuId",this.citys[0].duanjuid);
        params.append("jiFangId",this.aDuanJiFangId);
        params.append("yewuLeiXing",'1');
        params.append("gongdanHao",'1234561234');
        params.append("yewuHaoMa",'16555555555');
        this.$axios.post("/resourcePrediction/pointTopoint",params).then((res) => {
            if(res.data.code==200){    
                this.openAlert = true;    
                this.data = JSON.parse(res.data.data)
                var ziyuanList = this.data.ziYuanList
                if(this.data.biaoShi == 0){
                  if(ziyuanList.jifangList.length > 0){
                    if(ziyuanList.shebeiList.length > 0){
                        this.pointToPointMsg = '用户端有设备资源'
                    }else{
                        this.pointToPointMsg = '无资源，不具备开通要求'
                    }
                  }else{
                      if(ziyuanList.shebeiList.length > 0 && ziyuanList.guangqianList.length > 0){
                          this.pointToPointMsg = '有资源，具备开通要求'
                      }else{
                          this.pointToPointMsg = '无资源，不具备开通要求'
                      }
                  }
                  
                }else if(this.data.biaoShi == 1){
                  this.pointToPointMsg = this.data.fhYiJian
                }
                }else{
                  this.$toast.error(data.msg);
                }
        }).catch(() => {
            clearTimeout(this.timer)
        });
    },
    //点对网云快/云专查询数据
    pointToNet(){
      var yewuleixing = ''
      if(this.form.POSType == '公众'){
        yewuleixing = 1
      }else if(this.form.POSType == '专线'){
        yewuleixing = 2
      }
      let params=new URLSearchParams();
      params.append("p_louyu_xuhao",this.buildId!=null?this.buildId:-6);
      params.append("p_fzd",this.id!=null?this.id:-1);
      params.append("r_sulv",'');
      params.append("p_yewu_leixing",yewuleixing);
      this.$axios.post("/posport/getpost",params).then((res)=>{
        if(res.data.code === 200){
          this.pointToNetList = res.data.data
          if(this.pointToNetList.length <= 0){
              this.openAlert = true;
              this.action = 2
              this.pointToNetMsg = '暂无资源'
          }else{
              this.openPointToNet = true
          }
        }else{
          this.$toast.error(data.msg);
        }
        
      }).catch(() => {
            clearTimeout(this.timer)
        });
    },
    //关闭云快/云专数据列表
    closePointToNetDialog(){
      this.openPointToNet = false
      this.loadMsg = false
    },
    //点对网黄白金1、紫金2
    PointToNetGlod(){
      this.yellowPlatinum = ''
      let params=new URLSearchParams();
        params.append("diaoduLeiXing",'8');
        params.append("yhDuanJiFang",this.aDuanJiFangId);
        params.append("ywLeiXing",this.ywLeiXing);
        params.append("ywSuLv",this.form.bandwidth);
        this.$axios.post("/resourcePrediction/pointToglod",params).then((res)=>{
            if(res.data.code === 200){
              this.openAlert = true;
              this.action = 3
              this.PointToNetData = JSON.parse(res.data.data)
              if(this.PointToNetData.biaoShi == 0){
                this.yellowPlatinum = '有资源'   
              }else if(this.PointToNetData.biaoShi == 1){
                  this.yellowPlatinum = this.PointToNetData.fhYiJian
              }
            }else{
              this.$toast.error(data.msg);
            }
        }).catch(() => {
            clearTimeout(this.timer)
        });
    },
    //光缆接入方案预判
    //查询数据
    opticalCableAccess(){
      let params=new URLSearchParams();
        if(this.type == '0'){
          params.append("aDuanJiFangId",this.aDuanJiFangId);
        }else if(this.type == '放置点'){
          params.append("aDuanJiFangId",this.id);
        }
        params.append("diaoduLeiXing",'1');
        params.append("zDuanJiFangId",this.zDuanJiFangId);
        params.append("guangxinShu",'2');
        params.append("tzJieDianShu",'5');
        params.append("jieRuLeiXing",'3');
        this.$axios.post("/resourcePrediction/guanglanJieru",params).then((res)=>{
          if(res.data.code == 200){
            this.openAlert = true;
            this.action = 4
            this.opticalCableData = JSON.parse(res.data.data)
            // console.log(this.opticalCableData)
            if(this.opticalCableData == null){
                this.opticalCableMsg = '暂无资源' 
            }else{
              if(this.opticalCableData.biaoShi == 0){
                this.opticalCableMsg = '有资源'   
              }else if(this.opticalCableData.biaoShi == 1){
                  if(this.zDuanJiFangId){
                    this.opticalCableMsg = this.opticalCableData.fhYiJian
                  }else{
                    this.opticalCableMsg = '请选择局端机房'
                  }
              }
            }
          }else{
            this.$toast.error(res.data.msg);
          }
        }).catch(() => {
            clearTimeout(this.timer)
        });
    },
    //获取Z端机房id
    Zduanjfid(id){
      this.zDuanJiFangId = id
    },
    //通过A端机房id获取端局id 
    motorRoomId(id){
      this.aDuanJiFangId = id
      let params=new URLSearchParams();
      params.append("id",id);
      this.$axios.post("/motorRoom/findDuanjuByjifangId",params).then((res)=>{
        if(res.data.code === 200){
          this.endOffice = res.data.data
          this.Zbuilding(this.endOffice.duanjuid)
        }
      })
    },
    //再通过端局id 查询Z端楼宇(建筑物)
    Zbuilding(id){
      let params=new URLSearchParams();
      params.append("id",id);
      this.$axios.post("/motorRoom/findbuildIdByDuanjuId",params).then((res)=>{
        if(res.data.code === 200){
          this.ZbuildingObj = res.data.data
          this.form.building_z = this.ZbuildingObj.louyuname
          this.ZmotorRoom(this.ZbuildingObj.louyu_xuhao)
        }
      })
    },
    //通过局端建筑物查机房  传参建筑物id
    ZmotorRoom(id){
      let params=new URLSearchParams();
      params.append("id",id);
      this.$axios.post("/motorRoom/findjifangBybuildId",params).then((res)=>{
        if(res.data.code === 200){
          this.citys_z = res.data.data
          if(this.citys_z.length > 0){
            this.form.computerRoom_z = this.citys_z[0].name
            this.Zduanjfid(this.citys_z[0].id)
          }
        }
      })
    },
    //通过楼宇名称模糊查询楼宇名称 
    searchBuildings(){
      this.radio = ''
      let params=new URLSearchParams();
      params.append("louyuName",this.form.building_z);
      params.append("page",this.currPage);
      this.$axios.post("/building/getLouyuInfoByLouyuName",params).then((res)=>{
        this.total = res.data.total
        this.refreshing = false
        this.loading = false 
        if(res.data.code === 200){
          this.openBuildings = true
          // console.log(res.data.data.content)
          this.Buildingslist = this.Buildingslist.concat(res.data.data.content);   
        }else{
          this.$toast.error(res.data.msg);
        }
      }).catch((e)=>{
          this.$toast.error("数据加载错误");
      });
    },
    refresh(){
        this.total = 0;
        this.loadOver = false
        this.refreshing = true;
        this.currPage = 0;
        this.searchBuildings();

    },
    load(){
        this.loading = true;
        this.currPage++;
        this.searchBuildings();
    },
    //关闭楼宇查询列表
    closeBuildingsDialog(){
      this.openBuildings = false
      this.currPage = 0
      this.Buildingslist = []
    },
    //确认选择楼宇
    confirmBuildingSelect(){
      this.currPage = 0
      this.openBuildings = false
      this.form.building_z = this.Buildingslist[this.radio].name
      this.ZmotorRoom(this.Buildingslist[this.radio].id)
      this.Buildingslist = []
    },
    loading1(){
      clearTimeout(this.timer)
        this.loadMsg = true;
        this.timer = setTimeout(() => {
            this.loadMsg = false;
        },60000)  
    },
    toService(){
      // if(this.form.computerRoom != '无'){
        this.loading1()
        if(this.form.workType == '点对点业务'){
          this.pointToPoint()
        }else if(this.form.workType.includes('点对网云快/云专资源预判')){
          this.pointToNet()
        }else if(this.form.workType == '点对网黄白金'){
          this.ywLeiXing = 1
          this.PointToNetGlod()
        }else if(this.form.workType == '点对网紫金'){
          this.ywLeiXing = 0
          this.PointToNetGlod()
        }else if(this.form.workType == '光缆接入方案预判'){
          this.opticalCableAccess()
        }
      // }else{
      //   this.$toast.error("无机房信息,不可查询!");
      // }
    },
    //关闭模态框
    closeDialog(){
      this.openAlert = false
      this.loadMsg = false
    },
    //获取A端机房或放置点
    postData(){    
        let params=new URLSearchParams();
        params.append("id",this.buildId);
        this.$axios.post("/building/jifanglist",params).then((res) => {
            if(res.data.code==200){                                 
                // console.log(res.data)
                this.citys = res.data.data
                this.form.computerRoom = res.data.data[0].name
                // if(this.form.workType == '光缆接入方案预判'){
                  this.motorRoomId(res.data.data[0].id)
                // }
            }else{
                
            }
        }).catch(() => {
        
        });
    },
  },
  watch:{
        '$route'(to,from){
            this.Buildingslist = [];
            this.currPage = 0
            this.refreshing = false
            this.searchBuildings();
        },
        Buildingslist:{
            handler(){
                if(this.Buildingslist.length >= this.total){
                    this.loadOver = true
                } else {
                    this.loadOver = false
                }
            }
        },
        openAlert:{
          handler(){
            if(this.openAlert == true){
              this.loadMsg = false
            }
          }
        }
    },
   mounted() {
     if(this.type === '0'){
       this.postData();
     }
     
  },
};
</script>
<style>
.serv-b-form {
  padding-top: 10px;
}
.btnUni{
    /* position: absolute;
    bottom: 0;
    left:0; */
    margin-top:33%;
    background-color: #fff;
    height: 60px;
    width:100%;
    box-shadow: -1px 4px 2px 0px rgba(0,0,0,.2), 0 5px 4px 0 rgba(0,0,0,.14), 0 -4px 10px 0 rgba(0,0,0,.12);
}

.mu-form-item{
  padding:0 20px;
}
/* .mu_input{
  width:150px;
} */
.loadStyle{
  width:100%;
  height:100%;
  background:rgba(0,0,0,0.4);
  position: absolute;
  left:0;
  top:0;
  right:0;
  bottom: 0;
  margin:auto;
  z-index: 3
}
</style>
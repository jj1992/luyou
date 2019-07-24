<template>
  <div class="map">
    <div id="map-container">
      
      <iframe
        name="mapifram"
        src="./gisMap.html"
        style="overflow:hidden;top:0;position:absolute;left:0;height:100vh;width:100vw;"
        @load="success"
      />
      <div
        id="search-container"
        style="width:100vw;max-width:100vw;z-index: 999;"
      >
        <searchInput
          @missfocus="missfocus"
          :value.sync="mapSearch"
          show
          @tap="showChildren"
          max-width="100%"
          :has-search-icon="searchIcon"
          :has-back="backIcon"
          :placeholder="placeholder"
        >
          <div slot="left-content">
            <mu-row>
              <mu-col align-self="end">
                <mu-icon
                  style="width:100%"
                  value="navigate_before"
                  v-if="backShow"
                  @click="back"
                />
              </mu-col>
            </mu-row>

          </div>
          <div slot="right-content">
            <mu-row>
              <mu-col align-self="center">
                <mu-icon
                  style="width:100%;"
                  value="fullscreen"
                  @click="scanQR"
                />
              </mu-col>
            </mu-row>
          </div>
          
          <div slot="content1">
              <ul v-if="flag" style="margin:0;width:100%; list-style:none; background:#eee; padding:0; z-index:9999999999999999999999999999999999;">
                <li v-for="i in HistoryList2" :key="i.id" @click="selectUser(i)" style="padding-left:10px; font-size:16px; height:30px; line-height:30px; color:#000;">{{i}}</li>
              </ul> 
          </div>
          <div slot="content">
            <mu-expand-transition>
              <div v-if="typeShow">
                <mu-tabs  :value.sync="active" color="#2196f3" text-color="#2196f3" indicator-color="#2196f3" inverse full-width style="width:100%;">
                    <mu-tab @click='changeSelect'>空间资源</mu-tab>
                    <mu-tab @click='changeSelect'>放置点</mu-tab>
                    <mu-tab @click='changeSelect'>设备资源</mu-tab>
                    <mu-tab @click='changeSelect'>管线资源</mu-tab>
                </mu-tabs>

                <!-- 空间资源 -->
                <mu-list v-if="active === 0">
                  <mu-list-item
                    button
                    @click="buildingResult('Build')"
                    v-if="$util.hasRight('bulidingList')"
                  >
                    <mu-list-item-title>楼宇</mu-list-item-title>
                  </mu-list-item>
                  <mu-list-item
                    button
                    @click="bungalowResult('Bungalow')"
                    v-if="$util.hasRight('bulidingList')"
                  >
                    <mu-list-item-title>平房</mu-list-item-title>
                  </mu-list-item>
                  <mu-list-item
                    button
                    @click="CRoomSearch('MotorRoom')"
                    v-if="$util.hasRight('motorRoomList')"
                  >
                    <mu-list-item-title>机房</mu-list-item-title>
                  </mu-list-item>

                  <mu-list-item
                    button
                    @click="WPointSearch('WallPoint')"
                    v-if="$util.hasRight('wallPointList')"
                  >
                    <mu-list-item-title>壁挂点</mu-list-item-title>
                  </mu-list-item>
                  <mu-list-item
                    button
                    @click='OfficeListSearch'
                  >
                    <mu-list-item-title style="overflow:visible;">局所</mu-list-item-title>
                  </mu-list-item>
                  <mu-list-item
                    button
                  >
                    <mu-list-item-title style="overflow:visible;">局界</mu-list-item-title>
                  </mu-list-item>
                  <mu-list-item
                    button
                  >
                    <mu-list-item-title style="overflow:visible;">行政区</mu-list-item-title>
                  </mu-list-item>
                  <!-- <mu-list-item
                    button
                    @click="test"
                  >
                    <mu-list-item-title style="overflow:visible;">测试</mu-list-item-title>
                  </mu-list-item> -->
                </mu-list>

                <!-- 室外放置点 -->
                <mu-list v-if="active === 1">
                  <mu-list-item
                    button
                    @click="OutdoorActiveSearch('OutdoorActiveSwitchBox')"
                    v-if="$util.hasRight('outdoorPointList')"
                  >
                    <mu-list-item-title style="overflow:visible;">有源交接箱</mu-list-item-title>
                  </mu-list-item>  
                  <mu-list-item
                    button
                    @click="OutdoorPassiveSearch('OutdoorPassiveSwitchBox')"
                    v-if="$util.hasRight('outdoorPointList')"
                  >
                    <mu-list-item-title style="overflow:visible;">无源交接箱</mu-list-item-title>
                  </mu-list-item>
                  <mu-list-item
                    button
                    @click="OutdoorBaseSearch('OutdoorBaseStation')"
                    v-if="$util.hasRight('outdoorPointList')"
                  >
                    <mu-list-item-title style="overflow:visible;">室外基站</mu-list-item-title>
                  </mu-list-item>
                  <mu-list-item
                    button
                    @click="OutdoorPoleSearch('OutdoorPole')"
                    v-if="$util.hasRight('outdoorPointList')"
                  >
                    <mu-list-item-title style="overflow:visible;">室外电杆</mu-list-item-title>
                  </mu-list-item> 
                </mu-list>

                <!-- 管线资源 -->
                <mu-list v-if="active === 3">
                  <mu-list-item
                    button
                    @click="ManholeListSearch('Well')"
                  >
                    <mu-list-item-title style="overflow:visible;">地井</mu-list-item-title>
                  </mu-list-item>
                  <mu-list-item
                    button
                    @click="PoleListSearch('Pole')"
                  >
                    <mu-list-item-title style="overflow:visible;">电杆</mu-list-item-title>
                  </mu-list-item>
                  <mu-list-item
                    button
                    @click="TubulationListSearch('Pipe')"
                  >
                    <mu-list-item-title style="overflow:visible;">管段</mu-list-item-title>
                  </mu-list-item>
                  <mu-list-item
                    button
                    @click="BarsectionListSearch('Ganluduan')"
                  >
                    <mu-list-item-title style="overflow:visible;">杆路段</mu-list-item-title>
                  </mu-list-item>
                  <mu-list-item
                    button
                    @click='OpticalCableSearch'
                  >
                    <mu-list-item-title style="overflow:visible;">光缆</mu-list-item-title>
                  </mu-list-item>
                  <mu-list-item
                    button
                  >
                    <mu-list-item-title style="overflow:visible;">电缆</mu-list-item-title>
                  </mu-list-item>
                </mu-list>

                <!-- 设备资源 -->
                <mu-list v-if="active === 2">
                  <mu-list-item
                    button
                    @click="ActiveDeviceSearch('ActiveDevice')"
                    v-if="$util.hasRight('activeDeviceList')"
                  >
                    <mu-list-item-title style="overflow:visible;">有源设备</mu-list-item-title>
                  </mu-list-item>
                  <mu-list-item
                    button
                    @click="toPos('POS')"
                    v-if="$util.hasRight('POSlist')"
                  >
                    <mu-list-item-title>POS</mu-list-item-title>
                  </mu-list-item>
                  <mu-list-item
                    button
                    @click="CircuitQuery"
                    v-if="$util.hasRight('allRouteList')"
                  >
                    <mu-list-item-title style="overflow:visible;">电路查询</mu-list-item-title>
                  </mu-list-item>
                </mu-list>
                </div>

                <!-- <div>
                  <mu-list>
                  <mu-list-item button>
                    <mu-list-item-title>筛选</mu-list-item-title>
                  </mu-list-item>
               

                <mu-list-item button @click="scanQR" >
                    <mu-list-item-title >扫一扫</mu-list-item-title>
                </mu-list-item>
                </mu-list>
              </div> -->
            </mu-expand-transition>
            <mu-divider />
            <div v-if="listShow">
              <div style="max-height:50vh">
                <router-view />
              </div>

            </div>
          </div>
        </searchInput>
      </div>

      <mu-icon
        id="local-icon"
        value="gps_fixed"
        style="z-index: 999;"
        @click="localSearch"
      />

       <i @click='layerBtn' id="tuceng" class='iconfont icon-tuceng1' style="color:red"></i>
       <i @click='searchTheperiphery' :class="onOff == false ? 'zhoubian' : 'zhoubian2'" class='iconfont icon-dangqianweizhi1' style="color:red"></i>
       <!-- <i @click="searchTheperiphery" :class="onOff == false ? 'zhoubian' : 'zhoubian2'">搜周边</i> -->


      <!-- 图层弹窗 -->
      <mu-dialog :open.sync="selectLayer" max-width="100%" width="96%">
          <!-- <div>选择图层</div> -->
          <mu-container>
              <div class="select-control-group" >
                <!-- <mu-flex class="select-control-row">
                  <mu-checkbox label="全选" :input-value="checkAll" @change="handleCheckAll" ></mu-checkbox>
                </mu-flex> -->
                <mu-flex class="select-control-row my-row" :key="item.id" v-for="item in layerArr" >
                  <mu-checkbox :value="item" v-model="checkbox.selectLevel" :label="item"></mu-checkbox>
                </mu-flex>
              </div>
          </mu-container>
          <mu-button slot="actions" flat color="primary" @click="closeSelectLayer">关闭</mu-button>
          <mu-button  slot="actions" flat color="primary" @click="determineTheLayer">确定</mu-button> 
      </mu-dialog>

      <!-- 中间弹窗信息 -->

      <mu-dialog
        :title="dlgTitle"
        :open.sync="openDialog"
        max-width="100%"
        width="96%"
      >
        <div
          v-if="type===4"
          style="max-height:50vh;overflow: auto;"
        >
          <!-- <router-view  ></router-view> -->
          <buildingList
            :type="dlgType"
            :build-id="buildingId"
          />

        </div>
        <mu-button
          slot="actions"
          flat
          color="primary"
          @click="closeScrollDialog"
        >关闭</mu-button>
        <mu-button
          slot="actions"
          flat
          color="primary"
          @click="todoSomthing"
        >确定</mu-button>
      </mu-dialog>

      <mu-bottom-sheet :open.sync="openSheet">
        <!-- 底部楼宇信息 -->
        <div
          v-if="type===3"
          style="max-height:30vh;overflow:auto;margin-bottom:60px;"
        >
          <buildLocal
            :type="buildingType"
            :search="name"
            :has-detail="true"
          />
        </div>
        <!-- 底部按钮 -->
        <div  v-if="sheetButton === 1">
        <mu-flex
          class="btnUni"
          align-items="center"
        >
          <mu-flex
            justify-content="center"
            fill
          >
            <mu-button
              color="primary"
              @click="showCRoom"
              style="width:40%;"
            >机房({{ motorRoomCount }})</mu-button>
            <mu-button
              color="primary"
              @click="showWallPoint"
              style="width:40%; margin-left:5%;"
            >壁挂点({{ wallPointCount }})</mu-button>
          </mu-flex>
        </mu-flex>
        </div>
      </mu-bottom-sheet>

      <mu-bottom-sheet :open.sync="openSheet2">
        <!-- 底部放置点信息 -->
        <div
          v-if="type===5"
          style="max-height:30vh;overflow: auto;"
        >
          <outplocal
            :type="outplType"
            :search="name"
            :has-detail="true"
          />
        </div>
      </mu-bottom-sheet>
      <!-- 底部地井信息 -->
      <mu-bottom-sheet :open.sync="openManhole">
        <div
          v-if="type===6"
          style="max-height:30vh;overflow: auto;"
        >
          <manholelocal
            :search="name"
            :has-detail="true"
          />
        </div>
      </mu-bottom-sheet>
      <!-- 底部电杆信息 -->
      <mu-bottom-sheet :open.sync="openPole">
        <div
          v-if="type===7"
          style="max-height:30vh;overflow: auto;"
        >
          <polelocal
            :search="name"
            :has-detail="true"
          />
        </div>
      </mu-bottom-sheet>
      <!-- 底部管段信息 -->
      <mu-bottom-sheet :open.sync="openTubulation">
        <div
          v-if="type===8"
          style="max-height:30vh;overflow: auto;"
        >
          <tubulationlocal
            :search="name"
            :has-detail="true"
          />
        </div>
      </mu-bottom-sheet>
      <!-- 底部杆路段信息 -->
      <mu-bottom-sheet :open.sync="openBarsection">
        <div
          v-if="type===9"
          style="max-height:30vh;overflow: auto;"
        >
          <barsectionlocal
            :search="name"
            :has-detail="true"
          />
        </div>
      </mu-bottom-sheet>
      <!-- 底部局所信息 -->
      <mu-bottom-sheet :open.sync="openOffice">
        <div
          v-if="type===10"
          style="max-height:30vh;overflow: auto;"
        >
          <officeSearch
            :search="name"
            :has-detail="true"
          />
        </div>
      </mu-bottom-sheet>
      <!-- 底部光缆信息 -->
      <mu-bottom-sheet :open.sync="openOpticalCable">
        <div
          v-if="type===11"
          style="max-height:30vh;overflow: auto;"
        >
          <opticalCablelocal
            :search="name"
            :has-detail="true"
          />
        </div>
      </mu-bottom-sheet>
      <!-- 选取中心点坐标 -->
      <mu-bottom-sheet :open.sync="openRange" style="width:94%;margin-left:1.5%;padding-left:10px;margin-bottom:15px;">
          <div style="max-height:50vh;overflow: auto;">
            <span style="font-size:16px;font-weight:bold;color:#000;padding:8px 0;display:inline-block">输入搜索范围:</span><br/>
      <mu-form :model="form" label-position="left" label-width="100" auto-validate class="serv-b-form">
            <mu-form-item label="范围" label-position="left" prop="scope">
              <mu-text-field v-model="form.scope">米</mu-text-field>
            </mu-form-item>
      </mu-form>
          </div>
          <mu-button flat color="primary" @click="closeRange" style="margin-left:150px;">取消</mu-button>
          <mu-button flat color="primary" @click="defineSelect">确定</mu-button>
      </mu-bottom-sheet>
      <!-- 范围搜索资源列表 -->
      <mu-dialog title="资源列表" width="600" max-width="90%" :esc-press-close="false" :overlay-close="false" :open.sync="openRangeResult">
        <div style="width:100%;height:400px;overflow-y:scroll;-webkit-overflow-scrolling: touch;">
            <table class="" style="width:100%; border-collapse: collapse; border:none; margin-top:10px; font-size:14px;min-height:100px;">
          <tr style="font-size:16px;">
            <th style="width:40px;">选中</th>
            <th style="width:60px;">类型</th>
            <th>名称</th>
            <th style="width:60px;">空闲数</th>
          </tr>  
          <tr v-for="(item,index) in JFandFZDlist" :key="item.id"  style="text-align:center;">
            <td><mu-radio :value="index" v-model="radio"></mu-radio></td>
            <td>{{item.ziyuanleixing}}</td>
            <td>{{item.ziyuanmingcheng}}</td>
            <td>{{item.kongxianshu}}</td>
          </tr>
        </table>
        </div>
        <mu-button v-if="$util.hasRight('resourcePrediction')" slot="actions" flat color="primary" @click="toServiceBrace">资源预判</mu-button>
        <mu-button slot="actions" flat color="primary" @click="closeRangeResult">关闭</mu-button>
      </mu-dialog>
    </div>
  </div>
</template>

<script >
import buildingList from "../building/BuildingItemList.vue";
import buildLocal from "./BuildingLocalResult";
import outplocal from "./OutPLocalResult";
import manholelocal from "./ManholeResult";
import polelocal from "./PoleResult";
import tubulationlocal from "./TubulationSearch";
import barsectionlocal from "./BarsectionSearch";
import officeSearch from "./OfficeSearch";
import opticalCablelocal from "./OpticalCableResult";
export default {
  components: {
    buildingList,
    buildLocal,
    outplocal,
    manholelocal,
    polelocal,
    tubulationlocal,
    barsectionlocal,
    officeSearch,
    opticalCablelocal
  },
  data() {
    return {
      open: false,
      typeShow: false,
      listShow: false,
      trigger: null,
      type: 0,
      mapSearch: "",
      searchIcon: false,
      backIcon: false,
      placeholder: "请输入搜索名称",

      openSheet: false,
      openDialog: false,
      buildingId: "",
      backShow: false,
      dlgType: 1,
      dlgTitle: "",
      croomListItemIndex: "",
      openSheet2: false,
      sheetButton:1,

      motorRoomCount: 0,
      wallPointCount: 0,
      name: "",
      buildingType: "",
      HistoryList2:[],
      flag:false,
      qrCode:"",

      spaceResourcesList:false,
      outdoorPointBtnList:false,
      pipelineResourcesList:false,
      equipmentResourcesList:false,
      selectLayer:false,
      checkbox: {
        selectLevel: [],
      },
      layerArr:['地井','管段','电杆','杆路段','局所','端局局界','区局局界'],
      active:0,
      checkAll: false,
      openManhole:false,
      openTubulation:false,
      openBarsection:false,
      openPole:false,
      openOffice:false,
      openRange:false,
      openOpticalCable:false,
      form:{
        scope:200
      },
      longitude:'',
      latitude:'',
      point:{},
      openRangeResult:false,
      radio:'',
      JFandFZDlist:[],
      onOff:false
    };
  },
  //二维码扫描得到的字符串
  mounted() {
    // window.onScanResult=(str)=>{
    //   //this.$toast.success(str);
    //   // alert(str);
    //   alert(this)
    //   this.requestData(str) 
    // };
    try{
      this.HistoryList2 = JSON.parse(localStorage.getItem("HistoryList2")); 

      if(this.HistoryList2 == null || this.HistoryList2 == undefined){
        this.HistoryList2 =[];
      }
    }catch(e){
      this.HistoryList2=[];
    }
  },
  // created(){
  //   this.test()
  // },
  methods: {
    //图层按钮
    layerBtn(){
      this.selectLayer = true;
    },
    //取消图层选择
    closeSelectLayer(){
      this.selectLayer = false;
      // this.checkbox.selectLevel = []
    },
    //确定图层选择
    determineTheLayer(){
      this.selectLayer = false;
      // console.log(this.checkbox.selectLevel)
      // console.log(this.checkbox.selectLevel.includes('放置点'))
      // var fzdControl = this.checkbox.selectLevel.includes('放置点')
      var djControl = this.checkbox.selectLevel.includes('地井')
      var dgControl = this.checkbox.selectLevel.includes('电杆')
      var gdControl = this.checkbox.selectLevel.includes('管段')
      var gldControl = this.checkbox.selectLevel.includes('杆路段')
      var jsControl = this.checkbox.selectLevel.includes('局所')
      var djjControl = this.checkbox.selectLevel.includes('端局局界')
      var qjjControl = this.checkbox.selectLevel.includes('区局局界')
      // console.log(fzdControl,djControl,dgControl,gdControl,gldControl,jsControl,djjControl,qjjControl)
      // window.mapifram.gisParams.fzdControls(fzdControl);
      window.mapifram.gisParams.djControls(djControl);
      window.mapifram.gisParams.dgControls(dgControl);
      window.mapifram.gisParams.gdControls(gdControl);
      window.mapifram.gisParams.gldControls(gldControl);
      window.mapifram.gisParams.jsControls(jsControl);
      window.mapifram.gisParams.djjControls(djjControl);
      window.mapifram.gisParams.qjjControls(qjjControl);
    },
    //选取中心点
    rangeSearch(point){
      this.openRange = true
      this.point = point
    },
    //取消
    closeRange(){
      this.openRange = false
    },
    //确认范围搜索
    defineSelect(){
      this.openRange = false
      window.mapifram.gisParams.rangeSearchs(this.point,this.form.scope);
    },
    //搜索结果集合
    JZWandFZDgather(retinfos){
      var JZWlist=[],FZDlist=[];
      retinfos.map((item)=>{
        if(item.DEVTYPE == 'JZW'){
          return JZWlist.push(item.REFID)
        }else if(item.DEVTYPE == 'FZD'){
          return FZDlist.push(item.REFID)
        }
      })
      var retinfos_obj = {"JZW":JZWlist,"FZD":FZDlist}
      var retinfos_json = JSON.stringify(retinfos_obj)
      let params = new URLSearchParams();
      params.append("JZWandFZDmap",retinfos_json);
      this.$axios.post("/peripheral/peripheralSearch",params).then((res)=>{
          if(res.data.code == 200){
            this.openRangeResult = true
            this.JFandFZDlist = res.data.data
          }
      })
    },
    //跳转到资源预判页面
    toServiceBrace(){
      if(this.radio >= 0){
        var jyName =  this.JFandFZDlist[this.radio].ziyuanmingcheng
        var buildId = this.JFandFZDlist[this.radio].louyuxuyhao
        var buildName = this.JFandFZDlist[this.radio].louyumingcheng
        var ids = this.JFandFZDlist[this.radio].ziyuanId
        var type = this.JFandFZDlist[this.radio].ziyuanleixing
        if(type == '放置点'){
          // type = '放置点'
          this.$router.push({path:"/serviceBrace",query:{type:'放置点',id:ids,buildName:jyName}})
        }else if(type == '壁挂点' || type == '机房'){
          // type = '0'
          this.$router.push({path:"/serviceBrace",query:{type:'0',jyName:jyName,buildId:buildId,buildName:buildName,jfid:ids}})
        }
        // console.log(type,jyName,buildId,buildName)
      }
    },
    //关闭结果结合弹框
    closeRangeResult(){
       this.openRangeResult = false 
    },
    requestData(str) {
      let params = new URLSearchParams();
      params.append("QRcode",str); 
      this.$axios
        .post("/posdevoce/details", params)
        .then(res => {
          if(res.data.code === 200){
            if(res.data.data){
              this.$router.push({path:"/posDetail/",query:{"qrStr":str}});
            }else{
              this.$toast.error('该二维码没有关联设备');
            }
            
          } else {
            this.$toast.error(res.data.msg);
          }
          
        })
        .catch(() => {
          // this.alert = true;
          this.$toast.error('请求异常');
        });
    },
     selectUser(i){

       this.flag = false;
       this.mapSearch = i;
       this.typeShow = true;
     },
    searchVal(){
      var val = this.mapSearch
      val = val.trim() // 清除空格
      if(val!=""){
        if (this.HistoryList2.length > 0) { // 有数据的话 判断
          if (this.HistoryList2.indexOf(val) !== -1) { // 有相同的，先删除 再添加 
            this.HistoryList2.splice(this.HistoryList2.indexOf(val), 1)
            this.HistoryList2.unshift(val)
          } else { // 没有相同的 添加
            this.HistoryList2.unshift(val)
          }
        } else { // 没有数据 添加
          this.HistoryList2.unshift(val)
        }
        if (this.HistoryList2.length > 6) { // 保留六个值
          this.HistoryList2.pop()
        }
        localStorage.setItem('HistoryList2', JSON.stringify(this.HistoryList2))
      }

    },
    showChildren() {
      this.typeShow = true;
      this.flag = true;
    },
    // scan(){
    //   if(window.nativeApis){
    //     window.nativeApis.startQRScan();
    //   }else{
    //     this.$toast.error("浏览器不支持此功能");
    //   }
    // },
    back() {
      this.typeShow = true;
      this.backShow = false;
      this.listShow = false;
    },
    missfocus() {
      this.listShow = false;
      this.backShow = false;
      this.typeShow = false;
      this.flag = false;
    },
    changeSelect(){
      this.typeShow = true;
    },
    //楼宇
    buildingResult(type) {
      this.typeShow = false;
      this.backShow = true;
      this.listShow = true;
      this.flag = false;
      this.$router.push({
        path: "/buildingResult",
        query: { type: type, search: this.mapSearch }
      });
      this.searchVal();
    },
    //平房
    bungalowResult(type){
      this.typeShow = false;
      this.backShow = true;
      this.listShow = true;
      this.flag = false;
      this.$router.push({
        path: "/buildingResult",
        query: { type: type, search: this.mapSearch }
      });
      this.searchVal();
    },
    //机房
    CRoomSearch(type) {
      this.typeShow = false;
      this.backShow = true;
      this.listShow = true;
      this.flag = false;
      this.$router.push({
        path: "/CRoomSearch",
        query: { type: type, search: this.mapSearch }
      });
      this.searchVal();
    },
    //壁挂点
    WPointSearch(type) {
      this.typeShow = false;
      this.backShow = true;
      this.listShow = true;
      this.flag = false;
      this.$router.push({
        path: "/WPointSearch",
        query: { type: type, search: this.mapSearch }
      });
      this.searchVal();
    },
    //局所
    OfficeListSearch(){
      this.typeShow = false;
      this.backShow = true;
      this.listShow = true;
      this.flag = false;
      this.$router.push({
        path: "/officeList",
        query: { search: this.mapSearch }
      });
      this.searchVal();
    },
    //室外有源交接箱
    OutdoorActiveSearch(type) {
      this.typeShow = false;
      this.backShow = true;
      this.listShow = true;
      this.flag = false;
      this.$router.push({
        path: "/OutPSearch",
        query: { type: type, search: this.mapSearch }
      });
      this.searchVal();
    },
    //室外无源交接箱
    OutdoorPassiveSearch(type) {
      this.typeShow = false;
      this.backShow = true;
      this.listShow = true;
      this.flag = false;
      this.$router.push({
        path: "/OutPSearch",
        query: { type: type, search: this.mapSearch }
      });
      this.searchVal();
    },
    //室外基站
    OutdoorBaseSearch(type) {
      this.typeShow = false;
      this.backShow = true;
      this.listShow = true;
      this.flag = false;
      this.$router.push({
        path: "/OutPSearch",
        query: { type: type, search: this.mapSearch }
      });
      this.searchVal();
    },
    //室外电杆
    OutdoorPoleSearch(type) {
      this.typeShow = false;
      this.backShow = true;
      this.listShow = true;
      this.flag = false;
      this.$router.push({
        path: "/OutPSearch",
        query: { type: type, search: this.mapSearch }
      });
      this.searchVal();
    },
    //地井
    ManholeListSearch(type){
      this.typeShow = false;
      this.backShow = true;
      this.listShow = true;
      this.flag = false;
      this.$router.push({
        path: "/manholeList",
        query: { type: type, search: this.mapSearch }
      });
      this.searchVal();
    },


    //电杆
    PoleListSearch(type){
      this.typeShow = false;
      this.backShow = true;
      this.listShow = true;
      this.flag = false;
      this.$router.push({
        path: "/poleList",
        query: { type: type, search: this.mapSearch }
      });
      this.searchVal();
    },
    //管段
    TubulationListSearch(type){
      this.typeShow = false;
      this.backShow = true;
      this.listShow = true;
      this.flag = false;
      this.$router.push({
        path: "/tubulationList",
        query: { type: type, search: this.mapSearch }
      });
      this.searchVal();
    },
    //杆路段
    BarsectionListSearch(type){
      this.typeShow = false;
      this.backShow = true;
      this.listShow = true;
      this.flag = false;
      this.$router.push({
        path: "/barsectionList",
        query: { type: type, search: this.mapSearch }
      });
      this.searchVal();
    },
    //光缆
    OpticalCableSearch(){
      this.typeShow = false;
      this.backShow = true;
      this.listShow = true;
      this.flag = false;
      this.$router.push({
        path: "/opticalCableSearch",
        query: {search: this.mapSearch }
      });
      this.searchVal();
    },
    //有源设备
    ActiveDeviceSearch(type) {
      this.typeShow = false;
      this.backShow = true;
      this.listShow = true;
      this.flag = false;
      this.$router.push({
        path: "/ActiveDeviceSearch",
        query: { type1: type, search: this.mapSearch }
      });
      this.searchVal();
    },
    //电路查询
    CircuitQuery(){
      this.typeShow = false;
      this.backShow = true;
      this.listShow = true;
      this.flag = false;
      this.$router.push({
        path: "/circuitNumberResult",
        query: {search: this.mapSearch}
      });
      this.searchVal();
    },
    retractList() {
      this.listShow = false;
    },
    //POS
    toPos(type) {
      this.typeShow = false;
      this.backShow = true;
      this.listShow = true;
      this.flag = false;
      this.type = 2;
      this.open = true;
      this.$router.push({
        path: "/passiveDevice",
        query: { type: type, name: this.mapSearch }
      });
      this.searchVal();
    },
    localSearch() {
      window.mapifram.gisParams.getCurrentLocation();
    },
    showLocalResult(name,buildingType) {
      this.typeShow = false;
      this.listShow = false;
      this.type = 3;
      this.openSheet = true;
      this.name = name;
      this.buildingType = buildingType;
      // this.$router.push({path:"/buildingLocalResult",query:{type:'Build',search:name}});
    },
    showOutPLocalResult(id) {
      this.typeShow = false;
      this.listShow = false;
      this.type = 5;
      this.openSheet2 = true;
      this.name = id;
      this.outplType = "OutdoorPoint";
      // this.$router.push({
      //   path: "/outPLocalResult",
      //   query: { type: "OutdoorPoint", search: id }
      // });
    },
    //光缆定位
    showOpticalCableResult(guanglanId){
      this.typeShow = false;
      this.listShow = false;
      this.type = 11;
      this.openOpticalCable = true;
      this.name = guanglanId;
    },
    //地图 点击地井
    showManholeResult(id){
      this.typeShow = false;
      this.listShow = false;
      this.type = 6;
      this.openManhole = true;
      this.name = id;
      // this.$router.push({path:'/manholeDetail',query:{id:id}});
    },
    //地图 点击管段
    showTubulationResult(id){
      // console.log(id)
      // alert('管段')
      this.typeShow = false;
      this.listShow = false;
      this.type = 8;
      this.openTubulation = true;
      this.name = id;
      // this.$router.push({path:'/tubulationDetail',query:{id:id}});
    },
    //地图 点击电杆
    showPoleResult(id){
      // console.log(id)
      // alert('电杆')
      this.typeShow = false;
      this.listShow = false;
      this.type = 7;
      this.openPole = true;
      this.name = id;
      // this.$router.push({path:'/poleDetail',query:{id:id}});
    },
    //地图 点击杆路段
    showBarsectionResult(id){
      // console.log(id)
      // alert('杆路段')
      this.typeShow = false;
      this.listShow = false;
      this.type = 9;
      this.openBarsection = true;
      this.name = id;
      // this.$router.push({path:'/barsectionDetail',query:{id:id}});
    },
    //地图 点击局所
    showOfficeResult(id){
      // console.log(id,name)
      // alert('局所')
      this.typeShow = false;
      this.listShow = false;
      this.type = 10;
      this.openOffice = true;
      this.name = id;
      // this.$router.push({path:'/officeDetail',query:{id:id}});
    },
    showError(msg) {
      this.$toast.error(msg);
    },
    searchTheperiphery(){
      this.onOff = !this.onOff
      window.mapifram.gisParams.searchTheperiphery(this.onOff);
    },
    success() {
      window.mapifram.gisParams.showLocalResult = this.showLocalResult;
      window.mapifram.gisParams.showOutPLocalResult = this.showOutPLocalResult;
      window.mapifram.gisParams.showError = this.showError;
      window.mapifram.gisParams.getBuildingItem = this.getBuildingItem;
      window.mapifram.gisParams.showManholeResult = this.showManholeResult;
      window.mapifram.gisParams.showTubulationResult = this.showTubulationResult;
      window.mapifram.gisParams.showPoleResult = this.showPoleResult;
      window.mapifram.gisParams.showBarsectionResult = this.showBarsectionResult;
      window.mapifram.gisParams.showOfficeResult = this.showOfficeResult;
      window.mapifram.gisParams.rangeSearch = this.rangeSearch;
      window.mapifram.gisParams.JZWandFZDgather = this.JZWandFZDgather;
      window.mapifram.gisParams.showOpticalCableResult = this.showOpticalCableResult
      //已弃用      
      // this.getPlacePointList('','','','');
      
    },
		showCRoom(){
			this.type = 4;
      this.openDialog = true;
      this.dlgType = 1;
      this.dlgTitle = "机房";
      // this.$router.push({path:"/ItemCRoomResult",query:{type:1,buildId:this.buildingId}});
    },
    showWallPoint() {
      this.type = 4;
      this.openDialog = true;
      this.dlgType = 2;
      this.dlgTitle = "壁挂点";
      // this.$router.push({path:"/ItemWallPointResult",query:{type:2,buildId:this.buildingId}});
    },
    closeSimpleDialog() {
      this.openDialog = false;
    },  
    scanQR() {
      //启动原生二维码扫描
      // if(window.nativeApis){
      //   window.nativeApis.startQRScan();
      //   window.onScanResult=(str)=>{
      //     this.requestData(str) 
      //   }
      // }
      // else{
      //   this.$toast.error("浏览器不支持此功能");
      // }
      // var app = navigator.appVersion
      var u = navigator.userAgent
      var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
      // var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
      var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if(isAndroid) {
        if(window.nativeApis){
          window.nativeApis.startQRScan();
          window.onScanResult=(str)=>{
            this.requestData(str) 
          }
        }
      }
      else if(isIOS) {
        // alert('is  IOS')
  　　　 window.scan();
        window.alertText=(str)=>{
          this.requestData(str) 
        }
      }
      else{
        // alert('is pc')
        this.$toast.error("浏览器不支持此功能");
      }
    },
    getBuildingItem(ids) {
      var params = new URLSearchParams();
      for (var i = 0, len = ids.length; i < len; i++) {
        params.append("ids", ids[i]);
      }
      this.$axios.post("/building/buildingitem", params).then(response => {
        if (response.data.data.length > 0) {
          window.mapifram.gisParams.showCRoomInMap(response.data.data);
        }
      });
    },
    getPlacePointList(xmin, xmax, ymin, ymax) {
      var params = new URLSearchParams();
      params.append("xmin", xmin);
      params.append("xmax", xmax);
      params.append("ymin", ymin);
      params.append("ymax", ymax);
      this.$axios
        .post("/outdoorpoint/outdoorpointlist", params)
        .then(response => {
          if (response.data.data.length > 0) {
            window.mapifram.gisParams.requestFzdSucceeded(response.data.data);
          }
        });
    },
    closeScrollDialog() {
      this.openDialog = false;
    },
    changeCroomListItemIndex(croomListItemIndex) {
      this.croomListItemIndex = croomListItemIndex;
    },
    todoSomthing() {
      if (this.croomListItemIndex !== "") {
        this.openDialog = false;
        this.$toast.info("点击确定按钮，但现在不知道去哪里");
      } else {
        this.$toast.warning("请选择一条");
      }
    },
  }
};
</script>
<style  scoped>
#map-container {
  z-index: 1;
}
#search-container {
  margin-top: 5px;
}

#result-container {
  background-color: white;
  width: 100vw;
  max-width: 100vw;
  z-index: 999;
}
.mu-list{
  padding:3px 0
}
.mu-list > li {
  display: block;
  float: left;
  width: 25%;
}
.mu-list .mu-item-title {
  /* border-right: 1px solid #000; */
  color: blue;
  text-align: center;
}
.mu-input-content {
  background-color: white;
}

#local-icon {
  position: fixed;
  font-size: 24px;
  width: 30px;
  height: 30px;
  line-height: 28px;
  color: rgb(244, 67, 54);
  top: 146px;
  left: 22px;
  background-color: #ffffff;
  border: solid #57585a 0.0525em;
  border-radius: 5px;
  background-position: center;
  background-repeat: no-repeat;
  text-align: center;
}
#tuceng {
  position: fixed;
  font-size: 24px;
  width: 30px;
  height: 30px;
  line-height: 28px;
  color: #515151;
  top: 185px;
  left: 22px;
  background-color: #ffffff;
  border: solid #57585a 0.0525em;
  border-radius: 5px;
  background-position: center;
  background-repeat: no-repeat;
  text-align: center;
}
.zhoubian {
  position: fixed;
  font-size:24px;
  width: 30px;
  height: 30px;
  line-height: 28px;
  color: #515151;
  top: 220px;
  left: 22px;
  background-color: #ffffff;
  border: solid #57585a 0.0525em;
  border-radius: 5px;
  background-position: center;
  background-repeat: no-repeat;
  text-align: center;
  font-style:normal
}
.zhoubian2 {
  position: fixed;
  font-size:24px;
  width: 30px;
  height: 30px;
  line-height: 28px;
  color: #515151;
  top: 220px;
  left: 22px;
  background-color: #ccc;
  border: solid #57585a 0.0525em;
  border-radius: 5px;
  background-position: center;
  background-repeat: no-repeat;
  text-align: center;
  font-style:normal
}

.btnUni {
  position: fixed;
  bottom: 0;
  background-color: #fff;
  height: 60px;
  width: 100%;
  box-shadow: -1px 4px 2px 0px rgba(0, 0, 0, 0.2),
    0 5px 4px 0 rgba(0, 0, 0, 0.14), 0 -4px 10px 0 rgba(0, 0, 0, 0.12);
}

.my-row{
  margin-bottom:15px;
}
</style>


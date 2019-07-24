
<template>
  <div class="posDetail">
    <!-- 标题 -->
    <div>
      <mu-appbar class="" style="width: 100vw;" color="primary">
        <mu-button icon slot="left" @click="navigate_back">
          <mu-icon value="navigate_before"></mu-icon>
        </mu-button>
        POS详情
      </mu-appbar>
    </div>

    <!-- 循环渲染表单 -->
    <div style="overflow:scroll;padding-top:10px; margin-bottom:60px;">
      <mu-load-more @refresh="refresh" :refreshing="refreshing">
        <mu-row v-for="(item,index) in models" :key="index" class="line">
          <mu-col span="6" class="title">
            <span>{{item.title}}</span>
          </mu-col>
          <mu-col class="info" v-if="item.key != 'status'">
            {{
            content[item.key]
            }}
          </mu-col>
          <mu-col class="info" v-if="item.key === 'status'">
            {{
            getStatus(content[item.key])
            }}
          </mu-col>
          <mu-divider v-if="index < models.length-1"></mu-divider>
        </mu-row>
      </mu-load-more>
    </div>

    <!-- 底部的按钮 -->
    <mu-flex class="btnUni" align-items="center">
      <mu-flex justify-content="center" fill>
        <mu-button v-if="$util.hasRight('POSinto')" color="primary" @click="toAlertPos" style="width:30%; font-size:14px;">pos入位</mu-button>
        <mu-button v-if="$util.hasRight('POSrelevance')" color="primary" @click="toQrCode" style="width:30%; margin-left:2%; font-size:14px;">二维码关联</mu-button>
        <mu-button v-if="$util.hasRight('POSportList')" color="primary" @click="toTerminalDetail(content.id)" style="width:30%; margin-left:2%; font-size:14px;">端子详情</mu-button>      
      </mu-flex>
    </mu-flex>    


      <mu-dialog width="600" max-width="90%" :esc-press-close="false" :overlay-close="false" :open.sync="openAlert">
            <div>
             <mu-form :model="form"  ref="form_ly" >
                
              <mu-form-item prop="type" label="类型" label-position="left" :rules="typeRules">
                <mu-select   v-model="form.type" @change="optionsChange" placeholder='请选择'>
                  <mu-option v-for="(option,index) in types" :key="index"  :label="option.label" :value="option.value"></mu-option>
                </mu-select>
              </mu-form-item>

              <mu-form-item v-if="flag1" prop="ly" label="楼宇名称" label-position="left" :rules="lyRules" style="position:relative;">
                  <mu-text-field v-model="form.ly" placeholder='请填写' @focus="()=>{this.flag=true}" @blur="()=>{this.flag=false}"></mu-text-field>
                  <ul v-if="flag" style="width:200px; list-style:none; background:#eee; position:absolute; padding:0; left:45px; top:34px; z-index:999;">
                    <li v-for="i in HistoryList3" :key="i.id" @click="selectUser(i)" style="font-size:16px; height:30px; line-height:30px; color:#000;">{{i}}</li>
                  </ul>                  
              </mu-form-item>
              <mu-form-item v-if="flag2" prop="ly" label="放置点名称" label-position="left" :rules="lyRules" style="position:relative;">
                  <mu-text-field v-model="form.ly" placeholder='请填写' @focus="()=>{this.flag=true}" @blur="()=>{this.flag=false}"></mu-text-field>
                  <ul v-if="flag" style="width:200px; list-style:none; background:#eee; position:absolute; padding:0; left:45px; top:34px; z-index:999;">
                    <li v-for="i in HistoryList3" :key="i.id" @click="selectUser(i)" style="font-size:16px; height:30px; line-height:30px; color:#000;">{{i}}</li>
                  </ul>                  
              </mu-form-item>

              <mu-button color="primary" style="width:20%; float:right;" @click="searchPos">查询</mu-button>

              </mu-form>
            </div>
            <!-- <div v-if="searchResult.length > 0" class="con">
              <div class="conSon">
            <mu-load-more  :loaded-all="loadOver" @refresh="refresh" :refreshing="refreshing" :loading="loading" @load="load" :loading-text=" loadOver === true ? '已经到底了' : '正在努力加载...'">        

              <table class="" style="width:100%; border-collapse: collapse; border:none; margin-top:10px; font-size:14px;min-height:100px;">
                <tr>
                  <th>选中</th>
                  <th>名称</th>
                  <th>所属楼宇</th>
                </tr> 
                <tr v-for="item in searchResult" :key="item.id"  style="text-align:center;">
                  <td><mu-radio :value="item.motorId" v-model="radio"></mu-radio></td>
                  <td>{{item.motorName}}</td>
                  <td>{{item.buildName}}</td>
                </tr>
              </table>
            </mu-load-more>  
              </div>
            </div>                    -->
            
            <mu-button color="primary" style="" @click="toIndexGIS" >图选</mu-button>
            <mu-button color="primary" style="margin-left:10px;" @click="toAlertRemarks" >备注</mu-button>            
            <!-- <mu-button slot="actions" v-if="confirmShow" flat color="primary" @click="confirmPosUpdate">确认</mu-button> -->
            <mu-button slot="actions" flat color="primary" @click="closeSimpleDialog">关闭</mu-button>
      </mu-dialog>  
      <mu-dialog title="关联二维码" width="600" max-width="80%" :esc-press-close="false" :overlay-close="false" :open.sync="openAlert2">
        二维码已关联，是否将{{this.content.qrCode}}覆盖为{{this.scanstr}}
        <mu-button slot="actions" flat color="primary" @click="cencelBuild">取消</mu-button>
        <mu-button slot="actions" flat color="primary" @click="build">确定</mu-button>
      </mu-dialog>
      <mu-dialog title="提示" width="360" :open.sync="openSimpleAlert">
        请先关联二维码
        <mu-button slot="actions" flat color="primary" @click="closeSimpleAlert">关闭</mu-button>
      </mu-dialog>
      <mu-dialog title="请填写备注" width="360" :open.sync="openAlert3">

        <mu-form :model="form1"  label-width="100" ref="form_bz">
          <mu-form-item prop="textarea" label="备注信息" :rules="BzRules">
            <mu-text-field multi-line :rows="3" :rows-max="6" v-model="form1.textarea"></mu-text-field>
          </mu-form-item>
        </mu-form>

        <mu-button slot="actions" flat color="primary" @click="confirmRemarks">确认</mu-button>        
        <mu-button slot="actions" flat color="primary" @click="closeOpenAlert3">关闭</mu-button>
      </mu-dialog> 
      <mu-dialog title="确认绑定？" width="360" :open.sync="openAlert4">
        确认绑定为{{this.scanstr}}
        <mu-button slot="actions" flat color="primary" @click="bindStr">确认</mu-button>        
        <mu-button slot="actions" flat color="primary" @click="closeOpenAlert4">关闭</mu-button>
      </mu-dialog>   
      <!-- pos入位查询数据弹框 -->
      <div v-if="actionList" style="width:100%;height:100%;background:rgba(0,0,0,0.4);position: absolute;">
        <div  class="actionBox">
        <div class="actionList" v-if="searchResult.length > 0">     
        <mu-load-more  :loaded-all="loadOver" @refresh="refresh" :refreshing="refreshing" :loading="loading" @load="load" :loading-text=" loadOver === true ? '已经到底了' : '正在努力加载...'">        

        <table  class="" style="width:100%; border-collapse: collapse; border:none; margin-top:10px; font-size:14px;min-height:100px;">
          <tr style="font-size:16px;">
            <th>选中</th>
            <th>名称</th>
            <th>所属楼宇</th>
          </tr> 
          <tr v-for="item in searchResult" :key="item.id"  style="text-align:center;">
            <td><mu-radio :value="item.motorId" v-model="radio"></mu-radio></td>
            <td>{{item.motorName}}</td>
            <td>{{item.buildName}}</td>
          </tr>
        </table>
      </mu-load-more>  
        </div>
        <div v-else style="width:100%;min-height:300px;line-height:150px;text-align:center;font-size:20px;font-weight:bold;">无资源</div>
        <div class="btn">
          <mu-button slot="actions" v-if="confirmShow" flat color="primary" @click="confirmPosUpdate">确认</mu-button> 
          <mu-button slot="actions" flat color="primary" @click="closeactionList">关闭</mu-button>
          </div> 
        </div>  
        </div>  
  </div>

</template>

<script>
export default {
  props:['id','qrStr'],
  data() {
    return {
      actionList:false,
      flag:false,
      flag1:true,
      flag2:false,
      datas:false,
      HistoryList3:[],
      confirmShow:false,
      types:[
        {label:'壁挂点',value:'WallPoint'},
         {label:'室外放置点',value:'OutdoorPoint'},
          {label:'机房',value:'MotorRoom'}
      ],
      radio:'',
      content: {
        status:"",
        qrCode:"",
        name: "",
        buildName: "",
        bureau: "",
        installationSite: "",
        model: "",
        totalTerminalNum: "",
        freeTerminalNum: "",
        occupyTerminalNum: "",
        unknownTerminalNum: "",
        id: null
      },
      models: [
        {
          title: "POS名称",
          key: "name"
        },
        {
          title: "位置名称",
          key: "building"
        },
        {
          title: "局所",
          key: "bureau"
        },
        {
          title: "安装位置",
          key: "installationSite"
        },
        {
          title: "位置类型",
          key: "locationType"
        },
        {
          title: "位置描述",
          key: "positionDescription"
        },
        {
          title: "设备型号",
          key: "model"
        },
        {
          title: "端子总数",
          key: "totalTerminalNum"
        },
        {
          title: "空闲端子数",
          key: "freeTerminalNum"
        },
        {
          title: "占用端子数",
          key: "occupyTerminalNum"
        },
        {
          title: "未知占用端子数",
          key: "unknownTerminalNum"
        },
        {
          title: "二维码",
          key: "qrCode",
        },
        {
          title: "状态",
          key: "status",          
        }
      ],
      refreshing: false,
      openAlert: false,
      openAlert2: false,
      openAlert3:false,
      openAlert4:false,
      openSimpleAlert:false,
      searchResult:[],
      code:"",
      typeVal:'',
      form:{
        ly:"",
        type:''
      },
      form1:{
        textarea:''
      },
      lyRules: [  
      { validate: (val) => (val.length !==0 || val.length >= 2), message: '名称最少2个字'}
      ],
      typeRules: [
        { validate: (val) => !!val, message: '必须选择类别'}  
      ],
      BzRules: [
        { validate: (val) => !!val, message: '必须填写备注'}
      ],
      scanstr:'',
      loading:false,
      loadingData:false,
      currPage:0,
      loadOver:false,
      total:0,      
      openPointToNet:false
    };
  },
  watch:{
        '$route'(to,from){
            this.searchResult = [];
            this.currPage = 0;
            this.loading = false;
            this.searchPos();
        },
        searchResult:{
            handler(){
                if(this.searchResult.length >= this.total){
                    this.loadOver = true
                } else {
                    this.loadOver = false
                } 
            }
        }
    },
  methods: {
    selectUser(i){
      this.flag = false;
      this.form.ly = i;
    },
    searchVal(){
      //取值
      var val = this.form.ly;
      val = val.trim() // 清除空格
      if(val!=""){
        if (this.HistoryList3.length > 0) { // 有数据的话 判断
          if (this.HistoryList3.indexOf(val) !== -1) { // 有相同的，先删除 再添加 
            this.HistoryList3.splice(this.HistoryList3.indexOf(val), 1)
            this.HistoryList3.unshift(val)
          } else { // 没有相同的 添加
            this.HistoryList3.unshift(val)
          }
        } else { // 没有数据 添加
          this.HistoryList3.unshift(val)
        }
        if (this.HistoryList3.length > 6) { // 保留六个值
          this.HistoryList3.pop()
        }
        localStorage.setItem('HistoryList3', JSON.stringify(this.HistoryList3))
      }

    },    
    getStatus(status){
      if(status =="1"){
          return '未关联未入位';
      }else if(status=="2"){
          return "已关联未入位";
      }else if(status=="3"){
          return "已关联已入位";
      }else if(status=="4"){
          return "已入位未关联";
      }
    },
    toAlertRemarks(){
      this.openAlert3 = true;
    },
    confirmRemarks(){
      this.$refs.form_bz.validate().then((result) => {
          if(result){
              let params = new URLSearchParams();
              params.append("id",this.id);
              params.append("mark",this.form1.textarea);
              //params.append("type",this.form.type);

              this.$axios.post("wallpoint/addMark",params).then((resp)=>{
                  if(resp.data.code === 200){
                      //this.searchResult = resp.data.data;
                      this.$toast.success('备注成功');
                  }else{
                    this.$toast.error(resp.data.msg);
                  }
              }).catch((e)=>{

              });
          }        
      });      
      this.openAlert3 = false;
    },
    closeOpenAlert3(){
      this.openAlert3 = false;
    },
    optionsChange(value){
      this.typeVal = value
      if(value === 'MotorRoom' || value === 'WallPoint'){
        this.flag1 = true;
        this.flag2 = false;
      }else if(value === 'OutdoorPoint'){
        this.flag1 = false;
        this.flag2 = true;
      }
    },
    //确认选择
    confirmPosUpdate(){
      const relateId = this.radio 
      if(relateId!=''){
          let params = new URLSearchParams();
          params.append("id",this.id);
          params.append("type",this.typeVal);
          params.append("relateId",relateId);
          this.$axios.post("/posdevoce/update",params).then((resp)=>{
              if(resp.data.code === 200){
                  //pos入位操作
                  //this.searchResult = resp.data.data;
                  this.$toast.success('入位成功');
                this.refresh();
                 
              }else{
                this.$toast.error(resp.data.msg);
              }
              
              this.actionList = false;
          }).catch((e)=>{

          });
      }else{
        this.$toast.error('请选择一项!');
      }
    },
    //关闭查询列表
    closeactionList(){
      this.actionList = false
      this.currPage = 0
    },
    navigate_back() {
      this.$router.back(-1);
    },
    initData() {
      this.requestData();
    },
    requestData() {
      let params = new URLSearchParams();
      // console.info(this.id);
      // alert(this.qrStr+'1');
      //console.log("id:"+this.id+",qrStr:"+this.qrStr);
      if(this.id){
        params.append("id", this.id);
      } else {
        params.append("id", '');
      }

      if(this.content.qrCode || this.qrStr){
        params.append("QRcode" , this.content.qrCode || this.qrStr); 
      } else {
        params.append("QRcode" , ''); 
      }   
      this.$axios
        .post("/posdevoce/details", params)
        .then(res => {
          if(res.data.code === 200){
            if(res.data.data){
              this.content = res.data.data;
              this.refreshing = false;
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
    refresh() {
      this.refreshing = true;
      this.requestData();
      this.loadOver = false
      this.total = 0
      this.currPage = 0;
      this.searchPos();
    },
    load(){
        this.loading = true;
        // if(data.pageSize > this.currPage){
            this.currPage++;
            // this.loadOver = false
        // } else {
            // this.loadOver = true
        // }
        this.searchPos();
    },
    binding(id,QRcode){
      let params = new URLSearchParams();
      params.append("id",id);
      params.append("QRcode",QRcode);
      this.$axios.post("/wallpoint/relevance",params).then((resp)=>{
          if(resp.data.code === 200){
              //pos入位操作
              //this.searchResult = resp.data.data;
              this.$toast.success('关联成功');
              this.content.qrCode = QRcode;
          }else{
            this.$toast.error(resp.data.msg);
          }
          this.code="";
          this.openAlert2 = false;
      }).catch((e)=>{

      });
    },
    toAlertPos () {  
      if(!this.content.qrCode){
        this.openSimpleAlert = true;
      }else{
        this.openAlert = true;
        this.searchResult = [];        
      }
    },
    searchPos(index){
      
      var strs = encodeURIComponent(this.form.ly)
      // if(this.datas === false){
      //   this.confirmShow = true;
      // }
      // this.$refs.form_ly.validate().then((result) => {
          // if(result){
              // let params = new URLSearchParams();
              // params.append("name",this.form.ly);
              // params.append("type",this.form.type);
              this.$axios.post("/posdevoce/into?name=" + strs + "&type=" + this.form.type + "&page=" + this.currPage).then((resp)=>{     
                  this.total = resp.data.total
                  this.loadingData = false
                  this.refreshing = false
                  this.loading = false 
                  if(resp.data.code === 200){
                    this.actionList = true;
                    this.openAlert = false
                    if(!this.refreshing){
                        this.searchResult = this.searchResult.concat(resp.data.data);  
                        if(this.searchResult.length <= 0){
                          this.datas = true
                          this.confirmShow = false
                        }else{
                          this.confirmShow = true;
                          this.datas = false
                        }
                    }
                  }else{
                    this.$toast.error(resp.data.msg);
                  }
              }).catch((e)=>{

              });
          // }
      // });
      this.searchVal();  
    },
    toIndexGIS(){
       this.$router.push({ path: "/onlyGis",query:{posId:this.content.id}});
    },
    //关闭
    closeSimpleDialog(){
      this.openAlert = false;
      this.datas = false;
      this.confirmShow = false;
    },
    toTerminalDetail(id){
      this.$router.push({ path: "/odfTerminalDetail",query:{id:id}});
    },
    //启动二维码
    toQrCode(){
      // if(window.nativeApis){
      //   window.nativeApis.startQRScan();
      // }else{
      //   this.$toast.error("浏览器不支持此功能");
      // }    
      var u = navigator.userAgent, app = navigator.appVersion;
      var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
      var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if (isAndroid) {
        if(window.nativeApis){
          window.nativeApis.startQRScan();
          window.onScanResult=(str)=>{
            this.scanstr = str;
            if(!this.content.qrCode){
              this.openAlert4 = true;
            }else{
              this.code=str;
              this.openAlert2=true;
            }  
          }
        }
      }
      else if (isIOS) {
  　　　window.scan();
        window.alertText=(str)=>{
          this.scanstr = str;
          if(!this.content.qrCode){
            this.openAlert4 = true;
          }else{
            this.code=str;
            this.openAlert2=true;
          } 
        }
      }
      else{
        this.$toast.error("浏览器不支持此功能");
      }  
    },
    build() {
      this.binding(this.content.id,this.code);
      
    },
    cencelBuild () {
      this.code="";
      this.openAlert2 = false;
    },
    closeSimpleAlert(){
      this.openSimpleAlert = false;
    },
    bindStr(){

      this.binding(this.content.id,this.scanstr);

      this.openAlert4 = false;
      this.scanstr = '';
    },
    closeOpenAlert4(){
      this.openAlert4 = false;
      this.scanstr = '';
    }
  },
  //获取扫码后的字符串
  mounted() {
    this.initData();
    // window.onScanResult=(str)=>{
    //   // alert("1");
    //   // alert(this.content.id+','+str);

    //   this.scanstr = str;
    //   if(!this.content.qrCode){
    //     this.openAlert4 = true;
    //   }else{
    //     this.code=str;
    //     this.openAlert2=true;
    //   }  
    // };
    try{
      this.HistoryList3 = JSON.parse(localStorage.getItem("HistoryList3")); 
            if(this.HistoryList3 == null || this.HistoryList3 == undefined){
          this.HistoryList3 =[];
        }
      //console.log(this.HistoryList3)
    }catch(e){
      this.HistoryList3=[];
    }
  }

  // ----------------------------------------------------------------  跳转缓存 ----------------------------------------------------------------
  //  ,beforeRouteLeave (to, from, next) {
  //   if(to.name == "ItemCRoom"){
  //     this.$route.meta.keepAlive = false;
  //     next()
  //   } else {
  //     next()
  //   }
  // }
};
</script>

<style scoped>
.posDetail {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.line {
    line-height: 200%;
    padding: 0px 15px;
}
.info {
    text-align: right;
    font-size: 12px;
    padding: 10px 0px;
  }
  .title {
    font-weight: 800;
    font-size: 14px;
    padding: 10px 0px;
  }
  .btnUni{
    position: fixed;
    bottom: 0;
    background-color: #fff;
    height: 60px;
    width:100%;
    box-shadow: -1px 4px 2px 0px rgba(0,0,0,.2), 0 5px 4px 0 rgba(0,0,0,.14), 0 -4px 10px 0 rgba(0,0,0,.12);
  }
.con{
    width:100%;
    height:300px;
    overflow-y:scroll;
    -webkit-overflow-scrolling: touch;
  }
  .conSon{
    width:100%;
    min-height:301px;
  }
  .mu-dialog-wrapper{
    position: absolute !important;
  }
  .mu-overlay{
    position: absolute !important;
  }
  .actionBox{
    position: absolute;
    left:0;
    top:0;
    right:0;
    bottom:0;
    margin:auto;
    max-width: 90%;
    height: 360px;
    padding: 0;
     background:#fff;
    border-radius: 2px;
    font-size: 16px;
    box-shadow: 0 5px 5px -3px rgba(0,0,0,.2), 0 8px 10px 1px rgba(0,0,0,.14), 0 3px 14px 2px rgba(0,0,0,.12)
  }
  .actionList{
    width:100%;
    min-height:300px;
    height:300px;
    background:#fff;
    overflow-y:scroll; 
    -webkit-overflow-scrolling: touch;
    padding: 24px 24px 20px;
    
  }
  .btn{
    width: 100%;
    height: 60px;
    line-height: 60px;
    text-align: right;
  }
</style>

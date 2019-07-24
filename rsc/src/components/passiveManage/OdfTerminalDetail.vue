<template>
  <div class="terminalDetails" style=" height:100vh;" >
    <mu-appbar class="" style="width: 100%; position:fixed; top:0;" color="primary">
      <mu-button icon slot="left" @click="navigate_back">
        <mu-icon value="navigate_before"></mu-icon>
      </mu-button>
      POS端口详情
    </mu-appbar>

    <div class="pasdev-odfPost-header" style="margin-top:56px; height:300px; overflow:scroll;">
          <table class="pasdev-postGroup-table" border="1" style="width:100%; border-collapse: collapse; border:none;">
            <tr style="text-align:center; height:30px; border-bottom:1px solid #ddd;">
              <th style="width:20%;">端子号</th>
              <th style="width:40%;">状态</th>
              <th style="width:40%;">业务编号</th>
            </tr>
            <tr v-for="(item2,index) in this.data" style="text-align:center; height:30px; border-bottom:1px solid #ddd;" :key="item2.id"  @click="searchTwo(item2.id,index)" :class = "{changeColor:index===curIndex}">        
              <td>{{item2.portCode}}</td>
              <td>{{$store.state.posPortStatus[item2.status]}}</td>
              <td>
                <P style="margin-top:5px; margin-bottom:5px;background-color: rgb(76, 175, 80);color:#fff;padding:0 3px;" v-if="$util.hasRight('POSallRouteList')" v-for="item3 in item2.specialLineCode" :key="item3.id" @click="toFullRoute(item.specialLineCode[index],item.businessType)">{{item3}}</P>
              </td>             
            </tr>
          </table>        
    </div>

    <!-- <router-view></router-view> -->

    <div>
      <mu-expansion-panel :expand.sync="panel">
        <div slot="header" style="font-weight:bold;">
          <img src="../../assets/06_06.png" style="width:8px; height:8px; float:left; margin-top:22px; margin-right:10px;">
        <p style="float:left;">下联缆信息</p>  
        </div>       
         <mu-list style="background:rgb(245,245,245)">
          <mu-list-item :ripple="false">
            <mu-list-item-title style="width:auto; font-size:14px;">
              光缆编号
            </mu-list-item-title>
            <mu-list-item-action>
              {{data2.opticalFiberCode}}
            </mu-list-item-action>
          </mu-list-item>
          <mu-list-item :ripple="false">
            <mu-list-item-title style="width:auto; font-size:14px;">
              段编号
            </mu-list-item-title>
            <mu-list-item-action>
              {{data2.segmentCode}}
            </mu-list-item-action>
          </mu-list-item>
          <mu-list-item :ripple="false">
            <mu-list-item-title style="width:auto; font-size:14px;">
              芯序
            </mu-list-item-title>
            <mu-list-item-action>
              {{data2.coreSequence}}
            </mu-list-item-action> 
          </mu-list-item>
        </mu-list> 
      </mu-expansion-panel>
      <mu-expansion-panel  :expand.sync="expand3">
        <div slot="header" style="font-weight:bold;">
          <!-- <mu-button style="float:left; color:#5cb5fe; margin-left:-20px; margin-top:2px;" icon slot="left"> -->
            <img src="../../assets/06_06.png" style="width:8px; height:8px; float:left; margin-top:22px; margin-right:10px;">
          <!-- </mu-button>           -->
          <p style="float:left;">光分纤盒信息</p>
        </div>
         <mu-list style="background:rgb(245,245,245)">
          <mu-list-item :ripple="false">
            <mu-list-item-title style="width:auto; font-size:14px;">
              光分纤盒
            </mu-list-item-title>
            <mu-list-item-action>
              {{data2.fiberOpticbox}}
            </mu-list-item-action>
          </mu-list-item>
          <mu-list-item :ripple="false">
            <mu-list-item-title style="width:auto; font-size:14px;">
              接入点类型
            </mu-list-item-title>
            <mu-list-item-action>
              {{data2.aptype}}
            </mu-list-item-action>
          </mu-list-item>
          <mu-list-item :ripple="false">
            <mu-list-item-title style="width:auto; font-size:14px;">
              机房
            </mu-list-item-title>
            <mu-list-item-action>
              {{data2.motorRoom}}
            </mu-list-item-action> 
          </mu-list-item>
          <mu-list-item :ripple="false">
            <mu-list-item-title style="width:auto; font-size:14px;">
              模块编号
            </mu-list-item-title>
            <mu-list-item-action>
              {{data2.moduleCode}}
            </mu-list-item-action> 
          </mu-list-item>
          <mu-list-item :ripple="false">
            <mu-list-item-title style="width:auto; font-size:14px;">
              端子号
            </mu-list-item-title>
            <mu-list-item-action>
              {{data2.portCode}}
            </mu-list-item-action> 
          </mu-list-item>
          <mu-list-item :ripple="false">
            <mu-list-item-title style="width:auto; font-size:14px;">
              门牌地址
            </mu-list-item-title>
            <mu-list-item-action>
              {{data2.doorplate}}
            </mu-list-item-action> 
          </mu-list-item>
          <mu-list-item :ripple="false">
            <mu-list-item-title style="width:auto; font-size:14px;">
              ONU MAC地址
            </mu-list-item-title>
            <mu-list-item-action>
              {{data2.onumac}}
            </mu-list-item-action> 
          </mu-list-item>                                        
        </mu-list>        
      </mu-expansion-panel>
    </div>

  </div>
</template>

<script>
export default {
    props:["id"],
    data() {
        return {
            panel: false,
            // detailSwitchIcon: "menu",
            expand3: false,
            data:[],
            data2:{},
            code:"",
            userName:"",
            specialLineCode:"",
            curIndex:"",
            // code2:''
        };
    },
    created(){
      // this.code2 = this.$route.query.code1;
    },
    methods: {
        navigate_back() {
            this.$router.back(-1);
        },
        initDetailView() {
            var params = new URLSearchParams();
            
            params.append('id',this.id);

            this.$axios.post("/posport/list",params )
            .then((res)=>{
                if(res.data.code==200){
                  this.data=res.data.data;
                }else{
                  this.data=[];
                }
                //  this.$router.replace({path:"/OdfPostDetailTable",query:{terminalInfo:this.data.terminalInfo ||[]}});
            })
        },
        initDetailView2(){
          
        },
        searchTwo(id2,index){
            this.panel = true;
            this.expand3 = true;
            this.curIndex = index;
            //console.log(this.curIndex+','+index);
            var params = new URLSearchParams();
            params.append('id',id2);
            // console.log("id:"+id2+",index:"+index);
            this.$axios.post("/posport/details",params )
            .then((res)=>{
                //  console.log(res.data)
                if(res.data.code==200){
                  if(res.data.data)
                  this.data2=res.data.data;
                 
                }else{
                  this.data2={};
                }
                //  this.$router.replace({path:"/OdfPostDetailTable",query:{terminalInfo:this.data.terminalInfo ||[]}});
            })
        },
        toFullRoute(specialLineNo,type){
            if(type==='specialLine'){
                this.$router.push({path:'/lineFullroute/',query:{leasedLineStatus:specialLineNo.split(':')[1],code:specialLineNo.split(':')[0]}});
            }
            else if(type==='relaying'){
                this.$router.push({path:'/relayFullroute/',query:{specialLineCode:specialLineNo}});
            }
        },       
        // detailSwitch() {
        //     if (this.detailSwitchIcon === "menu") {
        //         this.detailSwitchIcon = "view_module";
        //         this.$router.replace({path:"/OdfPostDetailList",query:{terminalInfo:this.data.terminalInfo||[]}});
        //     } else {
        //         this.detailSwitchIcon = "menu";
        //         this.$router.replace({path:"/OdfPostDetailTable",query:{terminalInfo:this.data.terminalInfo||[]}});
        //     }
        //     this.expand3=true;
        // },
        // itemExpend(item){
        //   this.panel=true;
        //   this.code=item.code;
        //   this.userName=item.userName;
        //   this.specialLineCode=item.specialLineCode;
        // }
    },
    mounted() {
       this.initDetailView();
       this.initDetailView2();       
       
    }
};
</script>

<style scoped>
.pasdev-odfPost-header span {
    display: inline-block;
    padding: 10px 15px 0 10px;
    color: rgb(39, 38, 38);
}
.pasdev-postGroup-table th{
  border: none;
}
.pasdev-postGroup-table td{
  border: none;
}
.mu-expansion-panel__expand{
  margin: 0;
}
.changeColor{
  background:#eee;
}
</style>



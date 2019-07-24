<template>
  <div class="odfDetails" style=" height:100vh;" >
    <mu-appbar class="" style="width: 100%; position:fixed; top:0;" color="primary">
      <mu-button icon slot="left" @click="navigate_back">
        <mu-icon value="navigate_before"></mu-icon>
      </mu-button>
      {{this.code2}}模块详情
    </mu-appbar>

    <p class="pasdev-odfPost-header" style="margin-top:56px;">
      <!-- <mu-button style="float:left; color:#5cb5fe" icon slot="left"> -->
        <!-- <mu-icon value="all_out"></mu-icon> -->
        <img src="../../assets/06_06.png" style="width:8px; height:8px; margin-left:20px; margin-right:10px;">
      <!-- </mu-button> -->
      <span style="font-size:16px; padding-top:12px; padding-left:0; font-weight:bold;">端子信息</span>
      <mu-button style="float:right; color:#5cb5fe" icon slot="left" @click="detailSwitch">
        <mu-icon :value="detailSwitchIcon"></mu-icon>
      </mu-button>
    </p>
    
      <!-- <router-view></router-view> -->
    <odfDetailTable v-if="tableOrListShow" :terminalInfo="data.terminalInfo"></odfDetailTable>

    <odfDetailList v-else :terminalInfo="data.terminalInfo"></odfDetailList>
        
    <div>
      <mu-expansion-panel :expand.sync="panel" v-if="detailSwitchIcon=='menu'">
        <div slot="header" style="font-weight:bold;">
        <!-- <mu-button style="float:left; color:#5cb5fe; margin-left:-20px; margin-top:2px;" icon slot="left"> -->
          <img src="../../assets/06_06.png" style="width:8px; height:8px; float:left; margin-top:22px; margin-right:10px;">
        <!-- </mu-button>           -->
        <p style="float:left;">路由信息</p>  
        </div>       
         <mu-list style="background:rgb(245,245,245); font-size:12px;">
          <mu-list-item :ripple="false">
            <mu-list-item-title style="width:auto; font-size:12px;">
              端子号
            </mu-list-item-title>
            <mu-list-item-action>
              {{code}}
            </mu-list-item-action>
          </mu-list-item>
          <mu-list-item :ripple="false">
            <mu-list-item-title style="width:auto; font-size:12px;">
              用户名称
            </mu-list-item-title>
            <mu-list-item-action>
              {{userName}}
            </mu-list-item-action>
          </mu-list-item>
          <mu-list-item :ripple="false">
            <mu-list-item-title style="width:auto; font-size:12px;">
              电路编号/专线号
            </mu-list-item-title>
            <mu-list-item-action style="display:inline-block; margin-top:10px;">
              <span style="background-color: rgb(76, 175, 80);color:#fff;padding:0 3px; margin-left:3px; height:20px; line-height:20px; display:inline-block;" v-if="$util.hasRight('ODFallRouteList')" v-for="(item,index) in specialLineCode" :key="index" @click="toFullRoute(businessType,specialLineCode[index])">{{item}}</span>
               <span v-if="$util.hasRight('ODFportModifychip')&&status==2" @click="toCoreModification()" style="background:rgb(33, 150, 243);width:30px;height:20px;line-height:20px;color:#fff;text-align:center;margin-left:5px;display:inline-block;">改芯</span>
            </mu-list-item-action> 
          </mu-list-item>
        </mu-list> 
      </mu-expansion-panel>
      <mu-expansion-panel  :expand.sync="expand3">
        <div slot="header" style="font-weight:bold;">
          <!-- <mu-button style="float:left; color:#5cb5fe; margin-left:-20px; margin-top:2px;" icon slot="left"> -->
            <img src="../../assets/06_06.png" style="width:8px; height:8px; float:left; margin-top:22px; margin-right:10px;">
          <!-- </mu-button>           -->
          <p style="float:left;">端子分组信息</p>
        </div>
        <div style="height:150px; overflow:scroll; background:rgb(245,245,245);">
          <table class="pasdev-postGroup-table" border="1" style="width:100%; border-collapse: collapse; border:none;">
            <tr style="text-align:center;">
              <th style="width:30%;">本端_起止端子编号</th>
              <th style="width:40%;">对端机房或综合箱</th>
              <th style="width:30%;">缆段编号</th>
            </tr>
            <tr v-for="item2 in this.data.groupInfo" style="text-align:center;" :key="item2.id" >          
              <td>{{item2.startTerminalCode}}</td>
              <td>{{item2.endMotorRoom}}</td>
              <td>{{item2.segmentCode}}</td>
            </tr>
          </table>
        </div>

      </mu-expansion-panel>
    </div>

  </div>
</template>

<script>
import odfDetailTable from "./OdfPostDetailTable.vue"
import odfDetailList from "./OdfPostDetailList.vue"
export default {
    props:["id","code1"],
    components:{
      odfDetailTable,
      odfDetailList
    },
    data() {
        return {
            panel: false,
            status:-1,
            detailSwitchIcon: "menu",
            expand3: true,
            data:{},
            code:"",
            userName:"",
            specialLineCode:"",
            code2:'',
            tableOrListShow:true,
            portId:null,
            businessType:'',
        };
    },
    created(){
      this.code2 = this.$route.query.code1;
    },
    methods: {
        navigate_back() {
            this.$router.back(-1);
        },
        initDetailView() {
            var params = new URLSearchParams();
           
            params.append('id',this.id);

            this.$axios.post("/odfmodule/details",params )
            .then((res)=>{
                if(res.data.code==200){
                  this.data=res.data.data;
                }else{
                  this.data={};
                }
                //  this.$router.replace({path:"/OdfPostDetailTable",query:{terminalInfo:this.data.terminalInfo ||[]}});
            })
        },
        detailSwitch() {
            if (this.detailSwitchIcon === "menu") {
                this.detailSwitchIcon = "view_module";
                this.tableOrListShow = false;
                // this.$router.replace({path:"/OdfPostDetailList",query:{terminalInfo:this.data.terminalInfo||[]}});
            } else {
                this.detailSwitchIcon = "menu";
                this.tableOrListShow = true;
                // this.$router.replace({path:"/OdfPostDetailTable",query:{terminalInfo:this.data.terminalInfo||[]}});
            }
            this.expand3=true;
        },
        itemExpend(item){
          this.panel=true;
          this.code=item.code;
          this.userName=item.userName;
          this.specialLineCode=item.specialLineCode;
          this.portId = item.id;
          this.businessType = item.businessType;
          this.status = item.status
        },
        toFullRoute(type,specialLineCode){
          // this.codes = specialLineCode.split(':')[0]
          // this.leasedLineStatus = specialLineCode.split(':')[1]
          //console.log(specialLineCode.split(':')[0],specialLineCode.split(':')[1],type)
          //console.log(specialLineCode.split(':')[0],specialLineCode.split(':')[1])
          if(type==='specialLine'){
              this.$router.push({path:'/lineFullroute/',query:{leasedLineStatus:specialLineCode.split(':')[1],code:specialLineCode.split(':')[0]}});
          }
          else if(type==='relaying'){
              this.$router.push({path:'/relayFullroute/',query:{specialLineCode:specialLineCode}});
          }
      },
        toCoreModification(id){
          this.$router.push({path:'/coreModification/',query:{id:this.portId}});
        }
    },
    mounted() {
       this.initDetailView();
       
    },
    
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
.mu-item{
  padding:0 9px;
}
</style>



<template>
    <div>
        <mu-container style="width: 100%;padding:0px;height:100vh;display:flex;flex-direction:column" ref="container">
        <mu-appbar style="width: 100%;" color="primary">
            <mu-button icon slot="left" @click="navigate_back">
                <mu-icon value="navigate_before"></mu-icon>
            </mu-button>
            全程路由库查询
        </mu-appbar>
        <mu-tabs  :value.sync="active" color="#2196f3" text-color="#2196f3" indicator-color="#2196f3" inverse full-width style="width:100%">
            <mu-tab>调单基本信息</mu-tab>
            <mu-tab>专线信息</mu-tab>
            <mu-tab>路由信息</mu-tab>
        </mu-tabs>
        <div style="flex: 1 ;overflow: auto;">
            <!-- <router-view></router-view> -->
            <keep-alive>
            <orderSheetInfo v-if="active === 0" :data="orderSheetInfoData"></orderSheetInfo>
            
            <dedicatedLineInfo v-if="active === 1" :data="dedicatedLineInfoData"></dedicatedLineInfo>
       
            <routeInfo v-if="active === 2" :data="routeData" :code="v_code" :leasedLineStatus="v_leasedLineStatus" :aaddress='dedicatedLineInfoData.aaddress'></routeInfo>
             </keep-alive>
        </div>
        
    </mu-container>
    </div>
</template>
<script>
import orderSheetInfo from './OrderSheetInfo';
import dedicatedLineInfo from './DedicatedLineInfo';
import routeInfo from './RouteInfo';
export default {
    components:{
        orderSheetInfo,dedicatedLineInfo,routeInfo
    },
    props:['id','type','specialLineNo','code','leasedLineStatus'],
    data(){
        return{
            active:0,
            orderSheetInfoData:'',
            dedicatedLineInfoData:'',
            routeData:'',
            history:[],
            v_code:this.code,
            v_leasedLineStatus:this.leasedLineStatus
        }
    },
    created(){
        this.type = this.$route.query.type
        this.getPageData()
        this.postSheetData()
    },
    methods:{
        navigate_back(){
            this.$router.back(-1);
        },
        getPageData(){
                this.history = JSON.parse(localStorage.getItem('this.history'));//使用getItem方法的前提是，你再自己需要的地方使用了setItem方法
        },
        //调单基本信息
        postSheetData(){
            
            let params=new URLSearchParams();
            params.append("code",this.code);
            params.append("leasedLineStatus",this.leasedLineStatus);
            this.$axios.post("/speclalline/workdetails",params).then((res) => {
                if(res.data.code==200){                
                    this.orderSheetInfoData = res.data.data
                    this.postLineData(this.orderSheetInfoData.specialLineId)
                }else{
                    
                }
            }).catch(() => {
            
            });
        },
        //专线信息
        postLineData(id){
          //console.info(id);
            let params=new URLSearchParams();
            params.append("id",id);
            this.$axios.post("/speclalline/details",params).then((res) => {
                if(res.data.code==200){
                    this.dedicatedLineInfoData = res.data.data
                    this.postRouteData()
                    
                }else{
                    
                }
            }).catch(() => {
            
            });
        },
        //路由信息
        postRouteData(){
            let params=new URLSearchParams();
            params.append("code",this.code);
            params.append("leasedLineStatus",this.leasedLineStatus);
            this.$axios.post("/speclalline/routeList",params).then((res) => {
                if(res.data.code==200){
                    this.routeData = res.data.data
                   //console.log(this.obj)
                }else{
                   
                }
            }).catch(() => {
            
            });
        },
    },
    watch: {
        '$route'(to,from){
            this.active = 0
        }
    },

}
</script>

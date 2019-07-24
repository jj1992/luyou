<template>
    <div>
        <mu-container style="width: 100%;padding:0px;height:100vh;display:flex;flex-direction:column" ref="container">
        <mu-appbar style="width: 100%;" color="primary">
            <mu-button icon slot="left" @click="navigate_back">
                <mu-icon value="navigate_before"></mu-icon>
            </mu-button>
            全程路由库查询
        </mu-appbar>
        <mu-tabs :value.sync="active" color="#2196f3" text-color="#2196f3" indicator-color="#2196f3" inverse full-width style="width:100%">
            <mu-tab>调单基本信息</mu-tab>
            <mu-tab>电路信息</mu-tab>
            <mu-tab>路由信息</mu-tab>
        </mu-tabs>
        <div style="flex: 1 ;overflow: auto;">
            <keep-alive>
            <orderSheetInfo2 v-if="active === 0" :specialLineCode="v_specialLineCode"></orderSheetInfo2>
            <circuitryInfo v-if="active === 1" :specialLineCode="v_specialLineCode"></circuitryInfo>
            <routeInfo2 v-if="active === 2" :specialLineCode="v_specialLineCode" :title="orderSheetInfo2Data.title"></routeInfo2>
            </keep-alive>
        </div>

        
    </mu-container>
    </div>
</template>
<script>
import orderSheetInfo2 from './OrderSheetInfo2';
import circuitryInfo from './CircuitryInfo';
import routeInfo2 from './RouteInfo2';
export default {
    components:{
        orderSheetInfo2,circuitryInfo,routeInfo2
    },
    props:['id','type','specialLineNo','code','specialLineCode'],
    data(){
        return{
            active:0,
            v_specialLineCode:this.specialLineCode,
            orderSheetInfo2Data:''
        }
    },
    methods:{
        navigate_back(){
            this.$router.back(-1);
        },
    }
}
</script>

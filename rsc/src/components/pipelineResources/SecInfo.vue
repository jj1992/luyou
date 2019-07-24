<template>
    <div class="secinfo">
        <!-- <mu-container style="width: 100%;padding:0px;height:100vh;display:flex;flex-direction:column" ref="container"> -->
        <mu-appbar class="" style="width: 100%;position:fixed;top:0;z-index: 999" color="primary">
        <mu-button icon slot="left" @click="navigate_back">
            <mu-icon value="navigate_before"></mu-icon>
        </mu-button>
            截面信息
        </mu-appbar>

        <!-- <mu-tabs  :value.sync="currentIndex" color="#2196f3" text-color="#2196f3" indicator-color="#2196f3" inverse full-width style="width:100%;margin-top:58px;"> 
            <mu-tab :to="{path:'/sectionalDrawInfo',query:{}}" :replace=true >截面图</mu-tab>
            <mu-tab :to="{path:'/pipeHoleInfo',query:{}}" :replace=true > 管孔信息</mu-tab>
            <mu-tab :to="{path:'/cableInfo',query:{}}" :replace=true >缆信息</mu-tab>
        </mu-tabs>

        <div style="flex: 1 ;overflow: auto;">
            <transition name="slide">
                <router-view></router-view>
            </transition>
        </div> -->

        <mu-tabs  :value.sync="active" color="#2196f3" text-color="#2196f3" indicator-color="#2196f3" inverse full-width style="width:100%;margin-top:58px;">
            <mu-tab>截面图</mu-tab>
            <mu-tab>管孔信息</mu-tab>
            <mu-tab>缆信息</mu-tab>
        </mu-tabs>
        <div style="flex: 1;overflow:auto;">
            <keep-alive>
            <SectionalDrawInfo v-if="active === 0" :id="v_id"></SectionalDrawInfo>
            
            <PipeHoleInfo v-if="active === 1" :id="v_id"></PipeHoleInfo>
       
            <CableInfo v-if="active === 2" :id="v_id" :duanleixingId="v_duanleixingId"></CableInfo>
             </keep-alive>
        </div>
    <!-- </mu-container> -->
    </div>
</template>

<script>
import SectionalDrawInfo from './SectionalDrawInfo';
import PipeHoleInfo from './PipeHoleInfo';
import CableInfo from './CableInfo';
export default {
    components:{
        SectionalDrawInfo,PipeHoleInfo,CableInfo
    },
    props:['id',"duanleixingId"],
    data(){
        return{
            active:0,
            currentIndex: 0,
            v_id:this.id,
            v_duanleixingId:this.duanleixingId
        }
    },
    methods:{
        navigate_back(){
            this.$router.back(-1);
        },
        postData(){

        }
    }
}
</script>

<style scoped>
    
</style>

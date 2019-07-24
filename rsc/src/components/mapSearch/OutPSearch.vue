<template>

    <mu-container   class="OutPSearch">

        <hf-load-more :config="config">

            <template name="loop" slot-scope="props" >

                <mu-list toggle-nested >

                    <template v-for="(item,index)  in props.item">

                        <mu-list-item  nested :open="open === index">

                            <mu-list-item-content @click="toggleShow(index)">

                                <mu-list-item-title class="wall_title">

                                    <img src="../../assets/04_06.png" style="width:16px; height:16px;">
                                    {{item.name}}<span v-show="item.code != null">|</span>{{item.code}}<span v-show="item.shortName != null">|</span>{{item.shortName}}

                                </mu-list-item-title>

                                <mu-list-item-sub-title >

                                    <span class="item">
                                    {{item.reseau}}|{{item.bureau}}
                                    </span>

                                </mu-list-item-sub-title>

                            </mu-list-item-content>

                            <mu-list-item-action @click="showSearchPlacePointInMap(item.name,item.id)" style="margin-right:20px;">

                                <!-- <mu-icon value="location_on"/> -->
                                <img src="../../assets/01_14.png" style="width:30px; height:30px;" />

                            </mu-list-item-action>

                            <mu-list-item-action>

                                <mu-list-item-after-text>

                                    <router-link style="margin-left:25px;" :to="{path:'/outDoorDetail',query:{id:item.id}}">详情</router-link>

                                </mu-list-item-after-text>

                            </mu-list-item-action>

                            <mu-list-item button  slot="nested" style="background:#F5F5F5;" >

                                <mu-list-item-title >

                                    <mu-row class="wall_item">

                                        <mu-col span="6">维护单位|{{item.maintenanceDivision}}</mu-col>
                                        <mu-col span="6">放置点类型|{{item.type}}</mu-col>

                                    </mu-row>

                                </mu-list-item-title>

                            </mu-list-item>

                            <mu-list-item button  slot="nested" style="background:#F5F5F5;" >

                                <mu-list-item-title>

                                    <mu-row  class="wall_item">

                                        <mu-col span="12">位置描述|{{item.positionDescription}}</mu-col>

                                    </mu-row>

                                </mu-list-item-title>

                            </mu-list-item>

                            <mu-list-item button  slot="nested" style="background:#F5F5F5;" >

                                <mu-list-item-title>

                                    <mu-row  class="wall_item">

                                        <mu-col span="6">固定资产编号|{{item.fixedNumber}}</mu-col>
                                        <mu-col span="6">归属维护单位三级|{{item.ascriptionMaintenanceName}}</mu-col>

                                    </mu-row>

                                </mu-list-item-title>

                            </mu-list-item>

                        </mu-list-item>

                        <mu-divider></mu-divider>

                    </template>

                </mu-list>

            </template>

        </hf-load-more>

    </mu-container>

</template>

<script>

export default {
    props:["type","search"],
    data(){
        return {
            open:'',
            config:{
                url:'/map/search',
                params:{
                type: this.type,
                name: this.search,
                },
                pageNo:0,
                loadingText:'正在加载...',
            },
        };
    },
    mounted(){ 
        //挂载后 清除所有数据 重新加载
        this.loadData();
    },
    methods:{

        toggleShow(i){
            this.open =  this.open ===  i  ? '' : i;
        }
        ,
        loadData(){
            this.config.params = {
                type:this.type,
                name:this.search,
            }
        },
        showSearchPlacePointInMap(name,id){
            window.mapifram.gisParams.showSearchPlacePointInMap(name,id);
        }
    },
    watch:{
        '$route'(to,from){
            this.loadData();
        }
    }
}

</script>


<style scoped>

.buildingList{

    padding: 0px;

}
.wall_item{

    font-size: 12px;

}
.wall_title{
    font-size: 14px;
    font-weight: bold;
}
.mu_item{
    height:45px;
}
.mu-list{
    padding:0;
}
.container{
    padding-left:0;
    padding-right:0;
}
</style>

<template>

    <mu-container   class="CRoomSearch">

        <hf-load-more :config="config">

            <template name="loop" slot-scope="props" >

                <mu-list toggle-nested >

                    <template v-for="(item,index)  in props.item"   >

                        <mu-list-item  nested :open="open === index">

                            <mu-list-item-content @click="toggleShow(index)">

                                <mu-list-item-title class="wall_title">
                                    <img src="../../assets/02_03.png" style="width:16px; height:16px;">
                                    {{item.name}}
                                </mu-list-item-title>

                                <mu-list-item-sub-title >
                                    <span class="item">
                                        {{item.bureau}}|{{item.buildName}}
                                    </span>
                                </mu-list-item-sub-title>

                            </mu-list-item-content>

                            <mu-list-item-action>

                                <mu-list-item-after-text>

                                    <router-link :to="{path:'/computerRoomDetails',query:{id:item.id}}">详情</router-link>

                                </mu-list-item-after-text>

                            </mu-list-item-action>

                            <mu-list-item button  slot="nested" style="background:#F5F5F5;" >

                                <mu-list-item-title >

                                    <mu-row class="wall_item">

                                        <mu-col span="4">楼门|{{item.floorDoor}}</mu-col>
                                        <mu-col span="4">楼层|{{item.floor}}</mu-col> 
                                        <mu-col span="4">房间号|{{item.roomNum}}</mu-col>

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

                                        <mu-col span="6">机房类型|{{item.motorRoomType}}</mu-col>
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
        },
        loadData(){
            this.config.params = {
                type:this.type,
                name:this.search,
            }
        },
    },
    watch:{
        '$route'(to,from){
            this.loadData();
        },
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

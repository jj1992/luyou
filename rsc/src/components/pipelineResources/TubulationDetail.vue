<template>
    <div class="activeDeviceDetail">
        <mu-appbar class="" style="width: 100%;position:fixed;top:0" color="primary">
        <mu-button icon slot="left" @click="navigate_back">
            <mu-icon value="navigate_before"></mu-icon>
        </mu-button>
        管段详情
        </mu-appbar>
        
    <mu-list style="margin-top:56px;">
        <mu-list-item :ripple="false">
        <mu-list-item-title>
         A设备
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.ashebeimingcheng
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
         A设备描述
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.ashebeimiaoshu
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          B设备
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.bshebeimingcheng
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          B设备描述
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.bshebeimiaoshu
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          段类型
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.guanduanleixingmingcheng
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          A-B方向
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.abfangxiang
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          A-B角度
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.abjiaodu
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          B-A方向 
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.bafangxiang
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          B-A角度
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.bajiaodu
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          管段长度
        </mu-list-item-title>
        <mu-list-item-action>
            {{
                obj.changdu
            }}米
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          管孔总数
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.guankongzongshu
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          空闲管孔数
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.kongxianguankong
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          坏管孔数
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.huaiguankong
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          子孔总数
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.zikongzongshu
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          空闲子孔数
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.kongxianzikong
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          坏子孔数
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.huaizikongshu
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          局所
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.jusuomingcheng
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          维护单位
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.weihudanweimingcheng
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          产权类型
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.chanquanleixing
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          产权单位
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.chanquandanwei
          }}
        </mu-list-item-action>
      </mu-list-item>
       <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          状态
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.zhuangtai
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          管材
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.guancai
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          操作员
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.caozuo_yuan
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false" class="active-d-list">
        <mu-list-item-title>
          操作时间
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.caozuo_shijian
          }}
        </mu-list-item-action>
      </mu-list-item>
    </mu-list>

    <mu-flex class="active-d-flex" align-items="center">
      <mu-flex justify-content="center" fill>
        <mu-button color="primary" @click="toSecInfo(obj.id,obj.duanleixingId)">查看截面信息</mu-button>
      </mu-flex>
    </mu-flex>
    </div>
</template>

<script>
export default {
    props:['id'],
    data(){
        return{
          obj:{}
      }
    },
    methods:{
        navigate_back(){
            this.$router.back(-1);
        },
        toSecInfo(id,duanleixingId){
          this.$router.push({path:'/secInfo',query:{id:id,duanleixingId:duanleixingId}})
        },
        postData() {
          let params=new URLSearchParams();
          params.append("id",this.id);
          this.$axios.post("/guanduan/guanDuanDetails",params).then((res) => {
            if(res.data.code==200){
              this.obj = res.data.data;
            }
          })
          .catch(() => {
          
          });
        },
    },
    mounted(){
      this.postData()
    }
}
</script>

<style scoped>
    .active-d-flex{
        position: fixed;
        bottom: 0;
        background-color: #fff;
        height: 60px;
        width:100%;
        box-shadow: -1px 4px 2px 0px rgba(0,0,0,.2), 0 5px 4px 0 rgba(0,0,0,.14), 0 -4px 10px 0 rgba(0,0,0,.12);
    }
    .active-d-list{
        margin-bottom: 60px;
    }
    .mu-item{
      display:none;
    }
    .mu-item .mu-item-action{
      font-size: 12px;
      text-align: right;
      min-width: 235px;
    }  
    .mu-item-title{
      font-weight: blod;
      font-size: 14px;
    }
</style>



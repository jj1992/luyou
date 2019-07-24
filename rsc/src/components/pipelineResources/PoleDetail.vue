<template>
    <div class="activeDeviceDetail">
        <mu-appbar class="" style="width: 100%;position:fixed;top:0" color="primary">
        <mu-button icon slot="left" @click="navigate_back">
            <mu-icon value="navigate_before"></mu-icon>
        </mu-button>
        电杆详情
        </mu-appbar>
        
        <mu-list style="margin-top:56px;">
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          区局
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.qujumingcheng
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
          电杆材质
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.diangancaizhi
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          电杆编号
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.dianganbianhao
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          电杆类型
        </mu-list-item-title>
        <mu-list-item-action>
            {{
                obj.ganleixing
            }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
       <mu-list-item :ripple="false">
        <mu-list-item-title>
          电杆材质
        </mu-list-item-title>
        <mu-list-item-action>
            {{
                obj.diangancaizhi
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
          操作员
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.caozuoyuan
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
              obj.caozuoshijian
          }}
        </mu-list-item-action>
      </mu-list-item>
    </mu-list>

    <mu-flex class="active-d-flex" align-items="center">
      <mu-flex justify-content="center" fill>
        <mu-button color="primary" @click="toBarsectionResult(obj.id)">查看杆路段</mu-button>
      </mu-flex>
      <mu-flex justify-content="center" fill>
        <mu-button color="primary" @click="toCableResult('Pole')">查看缆</mu-button>
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
        // //查看杆路段
        toBarsectionResult(){
          this.$router.push({path:'/barsectionResult'});
        },
        // //查看缆
       toCableResult(type){
          this.$router.push({path:'/cableResult',query:{id:this.id,type:type}});
        },
        postData() {
          let params=new URLSearchParams();
          params.append("id",this.id);
          this.$axios.post("/pole/poleDetails",params).then((res) => {
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



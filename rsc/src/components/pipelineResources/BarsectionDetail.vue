<template>
    <div class="activeDeviceDetail">
        <mu-appbar class="" style="width: 100%;position:fixed;top:0" color="primary">
        <mu-button icon slot="left" @click="navigate_back">
            <mu-icon value="navigate_before"></mu-icon>
        </mu-button>
        杆路段详情
        </mu-appbar>
        
        <mu-list style="margin-top:56px;">
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          杆路段编号
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.ganluduanbianhao
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          A杆编号
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.adianganbianhao
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          A区局
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.aqujumingcheng
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          A局所
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.ajusuomingcheng
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
         B杆编号
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.bdianganbianhao
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
         B区局
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.bqujumingcheng
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
         B局所
        </mu-list-item-title>
        <mu-list-item-action>
            {{
                obj.bjusuomingcheng
            }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          杆路段长度
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
          A杆方向
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.aganfangxiang
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          A杆角度
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.aganjiaodu
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
        <mu-list-item :ripple="false">
        <mu-list-item-title>
          B杆方向
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.bganfangxiang
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          B杆角度
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.bganjiaodu
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          吊线总数
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.diaoxianzongshu
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          空闲吊线
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.kongxiandiaoxian
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
              obj.caouoshijian
          }}
        </mu-list-item-action>
      </mu-list-item>
    </mu-list>

    <mu-flex class="active-d-flex" align-items="center">
      <mu-flex justify-content="center" fill>
        <mu-button color="primary" @click="toCableResult('Ganluduan')">查看缆</mu-button>
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
        //查看缆
        toCableResult(type){
          this.$router.push({path:'/cableResult',query:{id:this.id,type:type}});
        },
        postData() {
          let params=new URLSearchParams();
          params.append("id",this.id);
          this.$axios.post("/ganluduan/ganLuDuanDetails",params).then((res) => {
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



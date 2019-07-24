<template>
    <div class="OpticalCableSegmentDetail">
        <mu-appbar class="" style="width: 100%;position:fixed;top:0" color="primary">
        <mu-button icon slot="left" @click="navigate_back">
            <mu-icon value="navigate_before"></mu-icon>
        </mu-button>
        光缆段详情
        </mu-appbar>
        
        <mu-list style="margin-top:56px;">
      
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          光缆编号
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.bianHao
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          光缆段号
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.opticalCableSegmentNumber
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          光缆类型
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.type
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          路由
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.router
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          线径
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.lineDiameter
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
              obj.propertyRightType
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          光纤型号
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.opticalFiberType
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          用途
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.purpose
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          光缆程式
        </mu-list-item-title>
        <mu-list-item-action>
            {{
                obj.opticalCableProgram
            }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          光纤类型
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.fiberType
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          设计长度
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.designLength
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          实际长度
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.actualLength
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          录入长度
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.entryLength
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          光芯数
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.opticalCoreNumber
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
              obj.office
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
              obj.maintenanceUnit
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          生产厂家
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.manufacturer
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
              obj.state
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
              obj.operator
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
              obj.operationTime
          }}
        </mu-list-item-action>
      </mu-list-item>
    </mu-list>

    <mu-flex class="active-d-flex" align-items="center">
      <mu-flex justify-content="center" fill>
        <mu-button color="primary" @click="toOpticalFiberCableBureau">光缆局向</mu-button>
      </mu-flex>
      <mu-flex justify-content="center" fill>
        <mu-button color="primary" @click="toOpticalCableSegmentRouting">光缆段路由</mu-button>
      </mu-flex>
    </mu-flex>
    </div>
</template>

<script>
export default {
  props:["id"],
    data(){
        return{
          obj:{
            // id : '光缆段ID',
            // bianHao : '光缆编号' ,
            // opticalCableSegmentNumber : '光缆段号',
            // type  : '光缆类型' ,
            // router : '路由',
            // lineDiameter : '线径',
            // propertyRightType   : '产权类型' ,
            // opticalFiberType   : '光纤型号' ,
            // purpose    : '用途',
            // opticalCableProgram   : '光缆程式' , 
            // fiberType   : '光纤类型' ,
            // designLength   : '设计长度' ,
            // actualLength : '实际长度' ,
            // entryLength   : '录入长度',   
            // opticalCoreNumber : '光芯数',   
            // office: '局所',  
            // maintenanceUnit: '维护单位',
            // manufacturer   : '生产厂家' ,
            // fixedAssetsNumber : '固定资产编号' ,
            // state   : '状态',       
            // operator  : '操作员',   
            // operationTime: '操作时间',
          },
          ids:'118'
        }
    },
    methods:{
        navigate_back(){
            this.$router.back(-1);
        },
        //查看光缆局向
        toOpticalFiberCableBureau(){
          this.$router.push({path:'/cableResult',query:{id:this.obj.id,type:"OpticalCableSegment"}});
        },
        //查看光缆段路由
        toOpticalCableSegmentRouting(){
            this.$router.push({path:'/opticalCableSegmentRouting',query:{id:this.obj.id}});
        },
        //查看光缆局向
        // to(){
        //   this.$router.push({path:'/opticalCableSegmentList'});
        // }
        postData() {
          let params=new URLSearchParams();
          params.append("id",this.id);
          this.$axios.post("/guanglanduan/details",params).then((res) => {
            if(res.data.code==200){
              this.obj = res.data.data;
            }else{
              this.obj={};
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



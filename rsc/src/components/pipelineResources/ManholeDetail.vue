<template>
    <div class="activeDeviceDetail">
        <mu-appbar class="" style="width: 100%;position:fixed;top:0" color="primary">
        <mu-button icon slot="left" @click="navigate_back">
            <mu-icon value="navigate_before"></mu-icon>
        </mu-button>
        地井详情
        </mu-appbar>
        
        <mu-list style="margin-top:56px;">
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
          管线编号
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.guanxianbianhao
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          管线名称
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.guanxianmingcheng
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          地井编号
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.dijingbianhao
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          规格型号
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.guigexinghao
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          地井类型
        </mu-list-item-title>
        <mu-list-item-action>
            {{
                obj.dijingleixing
            }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          关键井类型
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              keyWellType
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          是否智能井盖
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              whetherIntellect
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          竣工日期
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.jungongriqi
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          标注方向
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.biaozhufangxiang
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
          精确坐标
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.jingquezuobiaobiaoshi
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
          加锁标识
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.jiasuobiaoshi
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
              obj.danweimingcheng
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

    <!-- 修改关键井 -->
    <mu-dialog width="600" max-width="90%" :esc-press-close="false" :overlay-close="false" :open.sync="openKeyWellChange">
      <mu-form :model="form"  ref="form_position">
        <mu-form-item label="关键井类型" label-position="left">
          <mu-select no-data-text="请选择一项" filterable v-model="form.keyType">
            <mu-option v-for="item in keyTypeList" :key="item" :label="item" :value="item"></mu-option>
          </mu-select>
        </mu-form-item>
        <mu-form-item label="是否智能井盖" label-position="left">
          <mu-select no-data-text="请选择一项" filterable v-model="form.intellect">
            <mu-option v-for="item in intellectList" :key="item" :label="item" :value="item"></mu-option>
          </mu-select>
        </mu-form-item>

         <!-- <mu-form-item prop="keyType" label="关键井类型" label-position="left">
            <mu-text-field v-model="form.keyType" placeholder='请填写'></mu-text-field>                
        </mu-form-item> -->
        <!-- <mu-form-item prop="intellect" label="是否智能井盖" label-position="left">
            <mu-text-field v-model="form.intellect" placeholder='请填写'></mu-text-field>                
        </mu-form-item> -->
      </mu-form> 
        <mu-button slot="actions" flat color="primary" @click="submitChange">确认</mu-button>
        <mu-button slot="actions" flat color="primary" @click="closeChange">取消</mu-button>
    </mu-dialog>

    <mu-flex class="active-d-flex" align-items="center">
      <mu-flex justify-content="center" fill>
        <mu-button color="primary" @click="toTubulationResult(obj.id)">查看管段</mu-button>
      </mu-flex>
      <mu-flex justify-content="center" fill>
        <mu-button color="primary" @click="toCableResult('Well')">查看缆</mu-button>
      </mu-flex>
      <mu-flex justify-content="center" fill>
        <mu-button color="primary" @click="revise">修改</mu-button>
      </mu-flex>
    </mu-flex>
    </div>
</template>

<script>
export default {
  props:['id'],
    data(){
        return{
          obj:{},
          openKeyWellChange:false,
          form:{
            keyType:'',
            intellect:''
          },
          whetherIntellect:'',
          keyWellType:'',
          active:0,
          wellmsg:'',
          Isintellect:'',
          keyTypeList:['普通井','局前井','重点小区','商务楼宇','干线','各局自定'],
          intellectList:['否','是']
        }
    },
    methods:{
        navigate_back(){
            this.$router.back(-1);
        },
        toTubulationResult(){
          this.$router.push({path:'/tubulationResult',query:{id:this.id}});
        },
        //修改关键井弹框
        revise(){
          this.openKeyWellChange = true;
        },
        //取消修改
        closeChange(){
          
          this.openKeyWellChange = false;
        },
        //转换
        changeNum(){
          if(this.form.keyType == '普通井'){
            this.wellmsg = 0
          }else if(this.form.keyType == '局前井'){
            this.wellmsg = 1
          }else if(this.form.keyType == '重点小区'){
            this.wellmsg = 2
          }else if(this.form.keyType == '商务楼宇'){
            this.wellmsg = 3
          }else if(this.form.keyType == '干线'){
            this.wellmsg = 4
          }else if(this.form.keyType == '各局自定'){
            this.wellmsg = 5
          }
          if(this.form.intellect == '否'){
            this.Isintellect = 0
          }else if(this.form.intellect == '是'){
            this.Isintellect = 1
          }
        },
        //确认修改
        submitChange(){
          this.openKeyWellChange = false;
          this.changeNum()
          var obj = {
            id : this.obj.id,
            guanjianjingleixing: this.wellmsg,
            zhinengjinggai : this.Isintellect
          }
          console.log(JSON.stringify(obj))
          let params=new URLSearchParams();
          params.append("wellMap",JSON.stringify(obj));
          this.$axios.post("/well/updateGuanJianWell",params).then((res)=>{
            if(res.data.code == 200){
              this.keyWellType = this.form.keyType
              this.whetherIntellect = this.form.intellect
              this.$toast.success(res.data.msg)
            }else{
              this.$toast.error(res.data.msg)
            }
          }).catch(() => {
            this.$toast.error('网络错误!')
        });
        },
        //查看缆
        toCableResult(type){
          this.$router.push({path:'/cableResult',query:{id:this.id,type:type}});
        },
        postData() {
          let params=new URLSearchParams();
          params.append("id",this.id);
          this.$axios.post("/well/wellDetails",params).then((res) => {
            if(res.data.code==200){
              this.obj = res.data.data
              this.keyWellType = this.obj.guanjianjingleixing
              this.whetherIntellect = this.obj.zhinengjinggai
              this.form.keyType = this.obj.guanjianjingleixing
              this.form.intellect = this.obj.zhinengjinggai
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



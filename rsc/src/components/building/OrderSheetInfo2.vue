<template>
    <div>
        <mu-divider></mu-divider>
        <mu-list>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          调单号
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.workNo
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          项目工程
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.project
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          标题
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.title
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          制单日期
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.orderDate
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          制单部门
        </mu-list-item-title>
        <mu-list-item-action>
            {{
                obj.orderDept
            }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          制单人
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.orderName
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          申请单号
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.orderNumber
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          联系人
        </mu-list-item-title>
        <mu-list-item-action>
            {{
                obj.contact
            }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          联系电话
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.contactPhone
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
    </mu-list>
    </div>
</template>
<script>
export default {
  props:['specialLineCode'],
    data(){
        return{
            obj:{}
        }
    },
    methods:{
        postData(){
            let params=new URLSearchParams();
            params.append("specialLineCode",this.specialLineCode);
            this.$axios.post("/relaying/workdetails",params).then((res) => {
                if(res.data.code==200){
                  this.obj = res.data.data
                  this.$parent.orderSheetInfo2Data = res.data.data
                  //console.log(this.obj)
                }else{
                    this.obj = {}
                }
            }).catch(() => {
            
            });
        },
    },
    mounted() {
      this.postData();
    },
}
</script>

<style scoped>
    .mu-item .mu-item-action{
      font-size: 12px;
      text-align: right;
      min-width: 260px;
    }  
    .mu-item-title{
      font-weight: bold;
      font-size: 14px
    }
</style>
